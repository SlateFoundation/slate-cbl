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
        <enrollments-grid
          :student-competencies="studentCompetencies"
          @select="handleSelect"
        />

        <b-button
          ref="sidebarToggle"
          @click="uiStore.toggleSidebar"
        >
          Toggle Sidebar ({{ uiStore.sidebarIsOpen ? 'is open' : 'is not open' }})
        </b-button>

        <img
          class="img-fluid"
          src="@/assets/mockup-enrollments-bg.png"
        >
      </main>
      <b-sidebar
        id="sidebar"
        v-model="uiStore.$state.sidebarIsOpen"
        no-header
        right
        shadow
        width="375px"
      >
        <template #default="{ hide }">
          <advanced-portfolio-sidebar
            :skill="skill"
            :student="student"
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
import { useUi } from '@/store/ui';
import useAuth from '@/store/useAuth';
import useContentArea from '@/store/useContentArea';
import useStudentCompetency from '@/store/useStudentCompetency';
import useStudentList from '@/store/useStudentList';

export default {
  name: 'AdvancedPortfolioManager',
  components: {
    AdvancedPortfolioSidebar,
    CompetencyDropdown,
    EnrollmentsGrid,
  },

  data() {
    return {
      skill: null,
      student: null,
    };
  },

  computed: {
    ...mapStores(useUi, useAuth, useContentArea, useStudentList),
  },

  async mounted() {
    await this.authStore.required();
    const { user, token } = this.authStore;
    console.log(`user has session, token=${token}, welcome ${user.FirstName}!`);

    // common fetch options
    const fetchOptions = {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    };

    // get competencies and students lists for navigation selectors
    const [
      competencyAreasResponse,
      studentListsResponse,
    ] = await Promise.all([
      this.contentAreaStore.fetch('?summary=true'),
      this.studentListStore.fetch(),
    ]);

    console.log('competencyAreasResponse=%o', competencyAreasResponse);
    console.table(competencyAreasResponse.data);

    console.log('studentListsResponse=%o', studentListsResponse);
    console.table(studentListsResponse.data);

    // fake selection
    const selectedCompetencyArea = 'ELA';
    const selectedStudentsList = 'group:class_of_2021';

    console.log('selectedCompetencyArea=%o', selectedCompetencyArea);
    console.log('selectedStudentsList=%o', selectedStudentsList);

    // load students × competencies
    const [
      competenciesResponse,
      studentsResponse,
    ] = await Promise.all([
      fetch(`http://localhost:2190/cbl/competencies?limit=0&content_area=${selectedCompetencyArea}`, fetchOptions).then((response) => response.json()),
      fetch(`http://localhost:2190/people/*students?limit=0&list=${selectedStudentsList}`, fetchOptions).then((response) => response.json()),
    ]);

    console.log('competenciesResponse= %o', competenciesResponse);
    console.table(competenciesResponse.data);

    console.log('studentsResponse=%o', studentsResponse);
    console.table(studentsResponse.data);

    // load all intersecting StudentCompetency records, with no embedded data
    const studentCompetenciesResponse = await fetch(
      'http://localhost:2190/cbl/student-competencies'
      + '?limit=0'
      + '&summary=true'
      + `&students=${selectedStudentsList}`
      + `&content_area=${selectedCompetencyArea}`,
      fetchOptions,
    ).then((response) => response.json());

    console.log('studentCompetenciesResponse=%o', studentCompetenciesResponse);
    console.table(studentCompetenciesResponse.data);

    // fake selection
    const selectedCompetency = 'ELA.1';
    const selectedStudent = 'ccross';

    console.log('selectedCompetency=%o', selectedCompetency);
    console.log('selectedStudent=%o', selectedStudent);

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

    console.log('studentCompetencyDetailsResponse=%o', studentCompetencyDetailsResponse);

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

    console.log('demonstrationIds=%o', Array.from(demonstrationIds.values()));

    // fetch details of all referenced demonstrations
    const demonstrationDetailsResponse = await fetch(
      'http://localhost:2190/cbl/demonstrations'
      + `?q=id:${Array.from(demonstrationIds.values()).join(',')}`
      + '&include[]=Creator'
      + '&include[]=StudentTask.Task',
      fetchOptions,
    ).then((response) => response.json());

    console.log('demonstrationDetailsResponse=%o', demonstrationDetailsResponse);
    console.table(demonstrationDetailsResponse.data.map((demonstration) => ({
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
    handleSelect(data) {
      if (data) {
        if (data.student) {
          this.student = data.student;
        }

        if (data.skill) {
          this.skill = data.skill;
        }
      }

      // if data exists and sidebar is closed, open it
      this.uiStore.$patch({ sidebarIsOpen: !!data });
    },
  },
};
</script>
