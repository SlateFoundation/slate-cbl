<template>
  <div
    v-if="authStore.user"
    id="app"
  >
    <b-container
      fluid
      class="p-0"
    >
      <main>
        <competency-dropdown />
        <enrollments-grid @select="handleSelect" :selected="selected" />

        <img
          class="img-fluid"
          src="@/assets/mockup-enrollments-bg.png"
        >
      </main>
      <b-sidebar
        id="sidebar"
        v-model="visible"
        no-header
        right
        shadow
        width="375px"
      >
        <template #default="{ hide }">
          <advanced-portfolio-sidebar
            :selected="selected"
            @hide="hide"
          />
        </template>
      </b-sidebar>
    </b-container>
  </div>
</template>

<script>
import { mapStores } from 'pinia';

import AdvancedPortfolioSidebar from '@/components/AdvancedPortfolioSidebar.vue';
import CompetencyDropdown from '@/components/CompetencyDropdown.vue';
import EnrollmentsGrid from '@/components/EnrollmentsGrid.vue';
import useAuth from '@/store/useAuth';
import useContentArea from '@/store/useContentArea';
import useStudentList from '@/store/useStudentList';

const _log = (...args) => null //console.log(...args) // eslint-disable-line
const _table = (...args) => null //console.table(...args) // eslint-disable-line

export default {
  name: 'AdvancedPortfolioManager',
  components: {
    AdvancedPortfolioSidebar,
    CompetencyDropdown,
    EnrollmentsGrid,
  },

  data() {
    return {
      selected: null,
    };
  },

  computed: {
    ...mapStores(useAuth, useContentArea, useStudentList),
    visible: {
      get() {
        return !!this.selected
      },
      set(value) {
        if (!value) {
          this.selected = null
        }
      },
    },
  },

  async mounted() {
    await this.authStore.required();
    const { user, token } = this.authStore;
    _log(`user has session, token=${token}, welcome ${user.FirstName}!`);

    // common fetch options
    const fetchOptions = {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    };

    const selectedCompetencyArea = 'ELA';
    const selectedStudentsList = 'group:class_of_2021';

    // load all intersecting StudentCompetency records, with no embedded data
    const studentCompetenciesResponse = await fetch(
      'http://localhost:2190/cbl/student-competencies'
      + '?limit=0'
      + '&summary=true'
      + `&students=${selectedStudentsList}`
      + `&content_area=${selectedCompetencyArea}`,
      fetchOptions,
    ).then((response) => response.json());

    _log('studentCompetenciesResponse=%o', studentCompetenciesResponse);
    _table(studentCompetenciesResponse.data);

    // fake selection
    const selectedCompetency = 'ELA.1';
    const selectedStudent = 'ccross';

    _log('selectedCompetency=%o', selectedCompetency);
    _log('selectedStudent=%o', selectedStudent);

    // load all details needed to render sidebar
    const studentCompetencyDetailsResponse = await fetch(
      'http://localhost:2190/cbl/student-competencies'
      + '?limit=0'
      + `&student=${selectedStudent}`
      + `&competency=${selectedCompetency}`
      + '&include[]=demonstrationsAverage'
      + '&include[]=growth'
      + '&include[]=progress'
      + '&include[]=effectiveDemonstrationsData'
      + '&include[]=ineffectiveDemonstrationsData',
      fetchOptions,
    ).then((response) => response.json());

    _log('studentCompetencyDetailsResponse=%o', studentCompetencyDetailsResponse);

    // build a de-duplicated list of referenced demonstrations to fetch metadata details
    /**
     * NOTE: typically there are ways to get this just embedded, but this is a complex case
     * because "DemonstrationsData" are composite data products subject to some policy/optimization
     * and not directly 1:1 with records that could be serialized
     * */
    const demonstrationIds = new Set();
    studentCompetencyDetailsResponse.data.forEach((studentCompetency) => {
      Object.values(studentCompetency.effectiveDemonstrationsData)
        .forEach((skillDemonstrations) => {
          skillDemonstrations.forEach((demonstrationData) => {
            demonstrationIds.add(demonstrationData.DemonstrationID);
          });
        });
      Object.values(studentCompetency.ineffectiveDemonstrationsData)
        .forEach((skillDemonstrations) => {
          skillDemonstrations.forEach((demonstrationData) => {
            demonstrationIds.add(demonstrationData.DemonstrationID);
          });
        });
    });

    _log('demonstrationIds=%o', Array.from(demonstrationIds.values()));

    // fetch details of all referenced demonstrations
    const demonstrationDetailsResponse = await fetch(
      'http://localhost:2190/cbl/demonstrations'
      + `?q=id:${Array.from(demonstrationIds.values()).join(',')}`
      + '&include[]=Creator'
      + '&include[]=StudentTask.Task',
      fetchOptions,
    ).then((response) => response.json());

    _log('demonstrationDetailsResponse=%o', demonstrationDetailsResponse);
    _table(demonstrationDetailsResponse.data.map((demonstration) => ({
      DemonstrationID: demonstration.ID,
      Created: demonstration.Created,
      Creator: `${demonstration.Creator.FirstName} ${demonstration.Creator.LastName}`,
      DemonstrationDate: (new Date(demonstration.Demonstrated * 1000)).toLocaleDateString(),
      HasTaskLink: Boolean(demonstration.StudentTask),
      Description: demonstration.StudentTask
        ? demonstration.StudentTask.Task.Title
        : demonstration.PerformanceType,
    })));
  },

  methods: {
    handleSelect([competency, student]=[]) {
      if (competency === this.selected?.competency && student === this.selected?.student) {
        // user clicked same student
        this.$set(this, 'selected', null)
      } else {
        this.$set(this, 'selected', { student, competency })
      }
    },
  },
};
</script>
