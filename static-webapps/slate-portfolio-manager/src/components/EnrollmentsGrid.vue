<template>
  <table
    v-if="studentCompetencies && students && competencies"
    @click="handleTableClick"
    @mouseenter="highlightCells"
    @mouseleave="highlightCells"
    @mousemove="highlightCells"
  >
    <caption>
      {{ hoveredCell }}
      <br>
      {{ selectedCell }}
    </caption>
    <thead>
      <tr>
        <th>&nbsp;</th>
        <th
          v-for="student in students"
          :key="student.ID"
          class="col-heading"
          :class="{ '-is-highlighted': shouldHighlightCell({ student, competency: false }) }"
          :data-student="student.DisplayName"
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
          :data-competency="row.Descriptor"
          :class="{ '-is-highlighted': shouldHighlightCell({ competency: row, student: false }) }"
        >
          {{ row.Descriptor }}
        </th>
        <td
          v-for="value, i in row.values"
          :key="i"
          :data-competency="row.Descriptor"
          :data-student="students[i].DisplayName"
          :class="{ '-is-selected': isCellSelected({ competency: row, student: students[i] }) }"
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
      selectedCell: {
        domCache: null,
        student: '',
        competency: '',
      },
    };
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
    handleTableClick(event) {
      const cell = event.target.closest('td');
      if (cell === this.selectedCell.domCache) {
        Vue.set(this.selectedCell, 'domCache', '');
        Vue.set(this.selectedCell, 'competency', '');
        Vue.set(this.selectedCell, 'student', '');
        this.$emit('select', null);
        return;
      }

      Vue.set(this.selectedCell, 'domCache', cell);

      if (cell) {
        Vue.set(this.selectedCell, 'student', cell.dataset.student);
        Vue.set(this.selectedCell, 'competency', cell.dataset.competency);
        this.$emit('select', {
          student: cell.dataset.student,
          competency: cell.dataset.competency,
        });
      } else {
        Vue.set(this.selectedCell, 'student', '');
        Vue.set(this.selectedCell, 'competency', '');
        this.$emit('select', null);
      }
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

    isCellSelected(cell) {
      return cell.competency === this.selectedCell.competency
        && cell.student === this.selectedCell.student;
    },

    shouldHighlightCell(cell) {
      return cell.competency === this.hoveredCell.competency
        || cell.competency === this.selectedCell.competency
        || cell.student === this.hoveredCell.student
        || cell.student === this.selectedCell.student;
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
