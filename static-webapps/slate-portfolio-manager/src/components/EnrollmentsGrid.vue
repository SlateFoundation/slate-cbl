<template>
  <table
    v-if="studentCompetencies && students && competencies"
    @mouseenter="highlightCells"
    @mouseleave="highlightCells"
    @mousemove="highlightCells"
  >
    <thead>
      <tr>
        <th>&nbsp;</th>
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
          {{ row.Descriptor }}
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
      const { area, students } = this.$route.query;
      if (!(area && students)) {
        return null;
      }
      const response = this.studentCompetencyStore.get({
        limit: 0,
        students,
        content_area: area,
      });
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

  methods: {
    getCellClass(row, student, value) {
      const selected = this.selected || {};
      const { Code } = row;
      const { Username } = student;
      const isSelected = Code === selected.competency && Username === selected.student;
      return [
        `cbl-level-${value} bg-cbl-level-50 text-white`,
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
        Vue.set(this.hoveredCell, 'student', cell.dataset.student);
        Vue.set(this.hoveredCell, 'competency', cell.dataset.competency);
      } else {
        Vue.set(this.hoveredCell, 'student', '');
        Vue.set(this.hoveredCell, 'competency', '');
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
  },
};
</script>

<style lang="scss" scoped>
  @import '~bootstrap/scss/functions.scss';
  @import '~bootstrap/scss/variables.scss';

  $cell-max-width: 70px;
  $col-heading-border-color: rgba(black, .2);

  @mixin is-highlighted {
    background-color: rgba($link-color, .2);
    color: $link-color;
  }

  thead {
    background-color: white;
    box-shadow: 0 1px 0 black;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tbody {
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

    th {
      background-color: rgba(black, .05);
      border-bottom: 1px solid $col-heading-border-color;
      border-left: 0;
      border-top: 1px solid $col-heading-border-color;
      padding: .5em 1em;
      width: 15em;
    }

    .-is-highlighted {
      @include is-highlighted();
    }
  }

  th:first-child {
    padding-right: 1em;
  }

  .col-heading {
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
    left: 48px;
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
