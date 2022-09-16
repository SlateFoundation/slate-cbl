<template>
  <table
    v-if="studentCompetencies && students && competencies"
    @mouseenter="highlightCells"
    @mouseleave="highlightCells"
    @mousemove="highlightCells"
  >
    <caption>
      {{ hoveredCell }}
      <br>
      {{ selected }}
    </caption>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th
          v-for="student in students"
          :key="student.ID"
          class="col-heading"
          :class="{ '-is-highlighted': shouldHighlightStudent(student.ID) }"
          :data-student="student.ID"
        >
          <div class="col-heading-clip">
            <a
              class="col-heading-link"
              href="#"
            >
              <div class="col-heading-text">
                {{ student.DisplayName }}
              </div>
            </a>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.ID"
      >
        <th
          :data-competency="row.ID"
          :class="{ '-is-highlighted': shouldHighlightCompetency(row.ID) }"
        >
          {{ row.Descriptor }}
        </th>
        <td
          v-for="value, i in row.values"
          :key="i"
          :data-competency="row.ID"
          :data-student="students[i].ID"
          :class="{ '-is-selected': isCellSelected({ competency: row.ID, student: students[i].ID }) }"
          @click="$emit('select', [row.ID, students[i].ID])"
        >
          {{ value }}
          <div class="outline" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { range } from 'lodash';
import { mapStores } from 'pinia';

import useCompetency from '@/store/useCompetency';
import useStudent from '@/store/useStudent';
import useStudentCompetency from '@/store/useStudentCompetency';

export default {
  data() {
    return {
      hoveredCell: {
        domCache: null,
        student: '',
        competency: '',
      },
    };
  },

  props: {
    selected: Object,
  },

  computed: {
    ...mapStores(useCompetency, useStudent, useStudentCompetency),
    students() {
      const { students } = this.$route.query;
      return this.studentStore.get(`?limit=0&list=${students}`);
    },
    competencies() {
      const { area } = this.$route.query;
      return this.competencyStore.get(`?limit=0&content_area=${area}`);
    },
    studentCompetencies() {
      const { area, students } = this.$route.query;
      if (!(area && students)) {
        return null;
      }
      return this.studentCompetencyStore.get({
        limit: 0,
        students,
        content_area: area,
      });
    },
    rows() {
      if (!this.students || !this.competencies) {
        return null;
      }
      const studentIds = this.students.map((s) => s.ID);
      return this.competencies.map((competency) => {
        const { ID, Descriptor } = competency;
        const values = range(studentIds.length).map(() => 0);
        this.studentCompetencies.forEach((sc) => {
          const index = studentIds.indexOf(sc.StudentID);
          if (sc.CompetencyID === ID && index !== -1) {
            values[index] = Math.max(values[index] || 0, sc.BaselineRating);
          }
        });
        return { Descriptor, values, ID };
      });
    },
  },

  methods: {
    highlightCells(event) {
      const cell = event.target.closest('td, th');
      if (cell === this.hoveredCell.domCache) {
        return;
      }

      this.hoveredCell.domCache = cell;

      if (cell) {
        Vue.set(this.hoveredCell, 'student', parseInt(cell.dataset.student));
        Vue.set(this.hoveredCell, 'competency', parseInt(cell.dataset.competency));
      } else {
        Vue.set(this.hoveredCell, 'student', '');
        Vue.set(this.hoveredCell, 'competency', '');
      }
    },

    isCellSelected(cell) {
      return cell.competency === this.selected?.competency
        && cell.student === this.selected?.student;
    },

    shouldHighlightStudent(studentId) {
      return this.hoveredCell.student === studentId || this.selected?.student === studentId
    },

    shouldHighlightCompetency(competencyId) {
      return this.hoveredCell.competency === competencyId || this.selected?.competency === competencyId
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
      border: 1px solid;
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
        .outline {
          opacity: .4;
        }
      }

      &.-is-selected {
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
