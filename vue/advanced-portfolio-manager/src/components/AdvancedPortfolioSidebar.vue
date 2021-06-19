<template>
  <div class="advanced-portfolio-sidebar-contents bg-white">
    <!-- TODO: break all this up -->

    <header class="p-3">
      <b-row class="mb-2">
        <b-col>
          <h1 class="h4 my-1">
            Alysha Abernathy
          </h1>
          <h2 class="h5 text-muted m-0">
            ELA.2: Expressing Ideas
          </h2>
        </b-col>
        <b-col sm="auto">
          <b-button
            class="mx-n2"
            variant="link"
            pill
            @click="$emit('hide')"
          >
            <font-awesome-icon
              icon="times"
              class="text-muted"
            />
          </b-button>
        </b-col>
      </b-row>
    </header>

    <div class="bg-light mt-n2 mb-3 px-3 py-2">
      <b-form-checkbox switch>
        Show hidden items
      </b-form-checkbox>
    </div>

    <ol class="list-unstyled">
      <li>
        <b-container>
          <b-row class="border-top border-bottom py-2 align-items-center">
            <b-col>
              <button
                v-b-toggle.collapse-1
                class="btn-unstyled d-flex"
              >
                <h3 class="h6 m-0">
                  Year 2
                </h3>
              </button>
            </b-col>
            <b-col cols="4">
              <b-progress
                variant="warning"
                :value=".6"
                max="1"
              />
            </b-col>
          </b-row>
        </b-container>

        <b-collapse
          id="collapse-1"
          visible
        >
          <b-container>
            <b-row class="text-center py-2 border-bottom">
              <b-col>Baseline<br>9</b-col>
              <b-col>Performance<br>7.2</b-col>
              <b-col>Growth<br>-1.8</b-col>
            </b-row>
          </b-container>

          <ol class="list-unstyled">
            <li class="p-3 border-bottom">
              <h4 class="h6">
                ELA.2.3 Prepare the medium
              </h4>
              <ol class="list-unstyled">
                <li
                  v-for="item in ['foo', 'bar', 'baz']"
                  :key="item"
                >
                  <b-card
                    class="my-1 px-2 py-1 shadow-sm"
                    no-body
                  >
                    {{ item }}
                  </b-card>
                </li>
              </ol>
            </li>
          </ol>
        </b-collapse>
      </li>
    </ol>
  </div>
</template>
