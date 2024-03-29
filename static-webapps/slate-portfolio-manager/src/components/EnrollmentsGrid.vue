<template>
  <div
    v-if="studentCompetencies && students && competencies"
    class="overflow-x-auto"
  >
    <table
      @mouseenter="highlightCells"
      @mouseleave="highlightCells"
      @mousemove="highlightCells"
    >
      <thead>
        <tr>
          <th>
            &nbsp;
          </th>
          <th
            v-for="student in students"
            :key="student.Username"
            class="col-heading"
            :class="{ '-is-highlighted': shouldHighlightStudent(student.Username) }"
            :data-student="student.Username"
          >
            <div class="col-heading-clip">
              <a
                class="col-heading-link"
                href="#"
              >
                <div class="col-heading-text">
                  {{ getDisplayName(student) }}
                </div>
              </a>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row.Code"
        >
          <th
            :data-competency="row.Code"
            :class="{ '-is-highlighted': shouldHighlightCompetency(row.Code) }"
          >
            <div class="row-heading">
              <v-tooltip :text="row.Descriptor">
                <template #activator="{ props }">
                  <div
                    class="text-truncate"
                    v-bind="props"
                  >
                    {{ row.Descriptor }}
                  </div>
                </template>
              </v-tooltip>
            </div>
          </th>
          <td
            v-for="value, i in row.values"
            :key="i"
            :data-competency="row.Code"
            :data-student="students[i].Username"
            :class="getCellClass(row, students[i], value)"
            @click="$emit('select', { competency: row.Code, student: students[i].Username })"
          >
            {{ value }}
            <div class="outline" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-else>
    Select a list of students and a content area to load enrollments dashboard
  </div>
</template>

<script>
import { range } from 'lodash';
import { mapStores } from 'pinia';

import Student from '@/models/Student';
import useCompetency from '@/store/useCompetency';
import useStudent from '@/store/useStudent';
import useStudentCompetency from '@/store/useStudentCompetency';
import emitter from '@/store/emitter';

export default {
  props: {
    selected: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      hoveredCell: {
        domCache: null,
        student: '',
        competency: '',
      },
    };
  },

  computed: {
    ...mapStores(useCompetency, useStudent, useStudentCompetency),
    competencies() {
      const { area } = this.$route.query;
      const response = this.competencyStore.get(`?limit=0&content_area=${area}`);
      return response && response.data;
    },
    students() {
      const { students } = this.$route.query;
      const response = this.studentStore.get(`?limit=0&list=${students}`);
      return response && response.data;
    },
    studentCompetencies() {
      const response = this.getStudentCompetencies();
      return response && response.data;
    },
    rows() {
      if (!this.students || !this.competencies) {
        return null;
      }
      const studentIds = this.students.map((s) => s.ID);
      return this.competencies.map((competency) => {
        const { ID, Descriptor, Code } = competency;
        const values = range(studentIds.length).map(() => 0);
        this.studentCompetencies.forEach((sc) => {
          const index = studentIds.indexOf(sc.StudentID);
          if (sc.CompetencyID === ID && index !== -1) {
            values[index] = Math.max(values[index] || 0, sc.Level);
          }
        });
        return {
          Descriptor, values, Code, ID,
        };
      });
    },
  },

  mounted() {
    emitter.on('update-store', this.updateStore);
  },

  unmounted() {
    emitter.off('update-store', this.updateStore);
  },

  methods: {
    getStudentCompetencies(force) {
      const { area, students } = this.$route.query;
      if (!(area && students)) {
        return null;
      }
      const options = {
        limit: 0,
        students,
        content_area: area,
      };
      return this.studentCompetencyStore.get(options, force);
    },

    getCellClass(row, student, value) {
      const selected = this.selected || {};
      const { Code } = row;
      const { Username } = student;
      const isSelected = Code === selected.competency && Username === selected.student;
      return [
        `cbl-level-${value} bg-cbl-level-25`,
        isSelected && '-is-selected',
      ];
    },

    highlightCells(event) {
      const cell = event.target.closest('td, th');
      if (cell === this.hoveredCell.domCache) {
        return;
      }

      this.hoveredCell.domCache = cell;

      if (cell) {
        this.hoveredCell.student = cell.dataset.student;
        this.hoveredCell.competency = cell.dataset.competency;
      } else {
        this.hoveredCell.student = '';
        this.hoveredCell.competency = '';
      }
    },

    shouldHighlightStudent(username) {
      const selected = this.selected || {};
      return this.hoveredCell.student === username || selected.student === username;
    },

    shouldHighlightCompetency(code) {
      const selected = this.selected || {};
      return this.hoveredCell.competency === code || selected.competency === code;
    },

    getDisplayName(student) {
      return Student.getDisplayName(student);
    },

    updateStore(options) {
      let changed = false;
      const { StudentID, CompetencyID } = options;
      if (StudentID && this.students.find((s) => s.ID === StudentID)) {
        changed = true;
      } else if (CompetencyID && this.competencies.find((c) => c.ID === CompetencyID)) {
        changed = true;
      }
      if (changed) {
        this.getStudentCompetencies(true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  $link-color: #0288d1;

  $cell-max-width: 70px;
  $col-heading-border-color: rgba(black, .2);

  @mixin is-highlighted {
    background-color: rgba($link-color, .2);
    color: $link-color;
  }

  table {
    border-collapse: collapse;
    margin: 0;
    width: auto;
  }

  thead {
    background-color: white;
    box-shadow: 0 .5px 0 black;
    position: sticky;
    top: 0;
    z-index: 11;

    a {
      text-decoration: none;
    }

    th {
      background: none;
      border: none;
      box-shadow: 0 1px 0 black;
    }
  }

  tbody {
    th {
      background-color: white;
      border-bottom: 1px solid black;
      left: 0;
      padding: 0;
      position: sticky;
      z-index: 10;

      .row-heading {
        border-left: 0;
        box-shadow: .5px 0 0 black;
        overflow: hidden;
        padding: .5em 1em;
        text-overflow: ellipsis;
        width: 15em;
      }
    }

    .-is-highlighted .row-heading {
      @include is-highlighted();
    }

    td {
      border: 1px solid black;
      max-width: $cell-max-width;
      padding: .5em;
      position: relative;
      text-align: center;

      .outline {
        $outset: -4px;
        border: 4px solid $link-color;
        border-radius: 3px;
        opacity: 0;
        position: absolute;

        bottom: $outset;
        left: $outset;
        right: $outset;
        top: $outset;
      }

      &:hover,
      &:focus {
        z-index: 1;
        .outline {
          opacity: .4;
        }
      }

      &.-is-selected {
        z-index: 2;
        .outline {
          opacity: 1;
        }
      }
    }
  }

  th {
    text-align: left;
  }

  thead > tr > th.col-heading {
    border: 0;
    height: 150px;
    max-width: $cell-max-width;
    padding: 0;
    vertical-align: bottom;

    &:last-child .col-heading-link {
      border-bottom: 1px solid $col-heading-border-color;
    }
  }

  .col-heading-clip {
    background-color: white;
    height: 100%;
    overflow: hidden;
    width: 300%;
  }

  .col-heading-link {
    background-color: rgba(black, .05);
    border-top: 1px solid $col-heading-border-color;
    bottom: -125px;
    color: inherit;
    display: block;
    height: 58px;
    left: 47px;
    line-height: 1;
    overflow: hidden;
    padding: 20px 30px 20px 40px;
    position: relative;
    transform: rotate(-55deg);
    transform-origin: left bottom;
    width: 223px;

    .-is-highlighted & {
      @include is-highlighted();
    }

    &:hover,
    &:focus {
      background-color: rgba($link-color, .2);
      text-decoration: none;
    }
  }

  .col-heading-text {
    font-size: .875em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
