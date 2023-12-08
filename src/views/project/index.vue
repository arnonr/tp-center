<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-xl-row">
    <div class="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-12 mb-xl-10">
      <div class="card shadow-sm card-search mb-10">
        <div class="card-header">
          <h3 class="card-title">ค้นหา</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div
              class="col-12 col-lg-6 mt-3"
              v-if="selectOptions.center.length != 0"
            >
              <label for="campus_id">ศูนย์</label>
              <v-select
                label="name_th"
                placeholder="ศูนย์"
                :options="selectOptions.center"
                v-model="search.center_id"
                class="form-control"
                :clearable="true"
              ></v-select>
            </div>

            <div class="col-12 col-lg-6 mt-3">
              <label for="name_th">ชื่อโครงการ</label>
              <input
                type="text"
                name="txt-search-name"
                id="txt-search-name"
                class="form-control"
                v-model="search.name"
              />
            </div>
            <div
              class="col-12 col-lg-4 mt-3"
              v-if="selectOptions.project_type.length != 0"
            >
              <label for="project_type_id">ประเภทโครงการ</label>
              <v-select
                label="name"
                placeholder="ประเภทโครงการ"
                :options="selectOptions.project_type"
                v-model="search.project_type_id"
                class="form-control"
                :clearable="true"
              ></v-select>
            </div>

            <!-- <div class="col-12 col-lg-4 mt-3">
              <label for="responsible_staff">ผู้รับผิดชอบ</label>
              <input
                type="text"
                name="txt-search-responsible-staff"
                id="txt-search-responsible_staff"
                class="form-control"
                v-model="search.responsible_staff"
              />
            </div> -->

            <!-- <div class="col-12 col-lg-4 mt-3">
              <label for="in_organization">หน่วยงาน</label>
              <input
                type="text"
                name="txt-search-in_organization"
                id="txt-search-in_organization"
                class="form-control"
                v-model="search.in_organization"
              />
            </div> -->

            <div class="col-12 col-lg-4 mt-3">
              <label for="ex_organization">สถานประกอบการ</label>
              <input
                type="text"
                name="txt-search-ex_organization"
                id="txt-search-ex_organization"
                class="form-control"
                v-model="search.ex_organization"
              />
            </div>

            <div class="col-12 col-lg-1 mt-3">
              <label for="trl">TRL</label>
              <input
                type="number"
                name="txt-search-trl"
                id="txt-search-trl"
                class="form-control"
                v-model="search.trl"
              />
            </div>

            <!-- project_date -->
          </div>
        </div>
      </div>

      <div class="card shadow-sm card-table">
        <div class="card-header">
          <h3 class="card-title">รายการ</h3>

          <div class="card-toolbar">
            <router-link to="/project/add" class="btn btn-sm btn-light-success">
              <i class="fa fa-add"></i> เพิ่มข้อมูล
            </router-link>
          </div>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr class="fw-bold fs-6 text-gray-800">
                  <th
                    v-for="(hd, idx) in tableHeader"
                    :key="idx"
                    class="text-center"
                  >
                    {{ hd.columnName }}
                  </th>
                </tr>
              </thead>
              <tbody v-if="items.length != 0">
                <tr v-for="(it, idx) in items" :key="idx">
                  <td class="text-center">{{ it.name }}</td>
                  <td class="text-center">{{ it.center.name_th }}</td>
                  <td class="text-center">{{ it.project_type.name }}</td>
                  <td class="text-center">{{ it.trl }}</td>
                  <td>{{ it.ex_organization }}</td>
                  <td class="text-center">
                    {{
                      dayjs(it.project_date).locale("th").format("DD MMM BB")
                    }}
                  </td>
                  <td class="text-center">
                    <router-link
                      :to="'/project/' + it.id"
                      class="btn btn-sm btn-primary btn-icon"
                    >
                      <i class="fa fa-edit"></i>
                    </router-link>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="10">
                    <div class="text-center"><span>ไม่พบข้อมูล</span></div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="col-xxl-12">
              <div class="tp-pagination mt-30">
                <BlogPagination
                  :totalPage="totalPage"
                  :currentPage="currentPage"
                  @update:currentPage="currentPage = $event"
                />
              </div>
            </div>
            <!--  -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Layout-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default defineComponent({
  name: "project",
  components: {
    BlogPagination,
    vSelect,
  },
  setup() {
    const router = useRouter();
    const tableHeader = ref([
      {
        columnName: "ชื่อโครงการ",
        columnLabel: "name",
      },
      {
        columnName: "ศูนย์",
        columnLabel: "center",
      },
      {
        columnName: "ประเภท",
        columnLabel: "project_type",
      },
      {
        columnName: "TRL",
        columnLabel: "trl",
      },
      {
        columnName: "สถานประกอบการ",
        columnLabel: "ex_organization",
      },
      {
        columnName: "วันที่",
        columnLabel: "project_date",
      },
      {
        columnName: "จัดการ",
        columnLabel: "manage",
      },
    ]);

    interface info {
      id: number;
      project_type_id: number;
      center_id: number;
      name: string;
      responsible_staff: string;
      budget: string;
      in_organization: string;
      trl: number;
      ex_organization: string;
      project_date: string;
      is_publish: Number;
      center: {
        name_th: string;
      };
      project_type: {
        name: string;
      };
    }

    const items = ref<Array<info>>([]);

    const perPage = ref<Number>(10);
    const currentPage = ref<Number>(1);
    const totalPage = ref<Number>(1);
    const totalItems = ref<Number>(0);
    const search = ref<any>({
      center_id: null,
      project_type_id: null,
      code: "",
      name: "",
      responsible_staff: "",
      budget: "",
      in_organization: "",
      trl: "",
      ex_organization: "",
      project_date: "",
    });

    const selectOptions = ref({
      perPage: [
        { title: "20", value: 20 },
        { title: "40", value: 40 },
        { title: "60", value: 60 },
      ],
      center: [],
      project_type: [],
    });

    // Fetch
    const fetchProjectType = () => {
      ApiService.get("project-type")
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          selectOptions.value.project_type = data.data;
        })
        .catch(({ response }) => {
          console.log(response.data.errors);
        });
    };

    const fetchCenter = () => {
      let params = {};

      if (userData.group_id != 1) {
        params["id"] = userData.center_id;
      }

      ApiService.query("center", { params: params })
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          selectOptions.value.center = data.data;
        })
        .catch(({ response }) => {
          console.log(response.data.errors);
        });
    };

    const fetchItems = () => {
      const params = {
        perPage: perPage.value,
        currentPage: currentPage.value,
        ...search.value,
        project_type_id: search.value.project_type_id
          ? search.value.project_type_id.id
          : undefined,
        center_id: search.value.center_id
          ? search.value.center_id.id
          : undefined,
      };

      if (userData.group_id != 1) {
        params["center_id"] = userData.center_id;
      }

      ApiService.query("project", { params: params })
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          items.value = data.data;
          totalPage.value = data.totalPage;
          totalItems.value = data.totalData;
        })
        .catch(({ response }) => {
          console.log(response.data.errors);
        });
    };

    // watch
    watch(
      [currentPage, search],
      () => {
        fetchItems();
      },
      { deep: true }
    );

    // Mounted
    onMounted(() => {
      fetchProjectType();
      fetchCenter();
      fetchItems();
    });

    const userData = JSON.parse(localStorage.getItem("userData") || '{}');

    return {
      tableHeader,
      totalPage,
      totalItems,
      search,
      items,
      perPage,
      currentPage,
      selectOptions,
      router,
      dayjs,
      userData,
    };
  },
});
</script>
