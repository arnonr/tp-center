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
              class="col-12 col-lg-4"
              v-if="selectOptions.campus.length != 0"
            >
              <label for="campus_id">วิทยาเขต</label>
              <v-select
                label="name_th"
                placeholder="วิทยาเขต"
                :options="selectOptions.campus"
                v-model="search.campus_id"
                class="form-control"
                :clearable="true"
              ></v-select>
            </div>

            <div class="col-lg-4">
              <label for="code">รหัส</label>
              <input
                type="text"
                name="txt-search-campus-id"
                id="txt-search-campus-id"
                class="form-control"
                v-model="search.code"
              />
            </div>
            <div class="col-lg-4">
              <label for="short_name">ตัวย่อ</label>
              <input
                type="text"
                name="txt-search-short-name"
                id="txt-search-short-name"
                class="form-control"
                v-model="search.short_name"
              />
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-4">
              <label for="name_th">ชื่อศูนย์ (TH)</label>
              <input
                type="text"
                name="txt-search-name-th"
                id="txt-search-name-th"
                class="form-control"
                v-model="search.name_th"
              />
            </div>
            <div class="col-lg-4">
              <label for="name_en">ชื่อศูนย์ (EN)</label>
              <input
                type="text"
                name="txt-search-name-en"
                id="txt-search-name-en"
                class="form-control"
                v-model="search.name_en"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm card-table">
        <div class="card-header">
          <h3 class="card-title">รายการ</h3>

          <div class="card-toolbar" v-if="userData.group_id == 1">
            <router-link to="/center/add" class="btn btn-sm btn-light-success">
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
                  <td class="text-center">{{ it.code }}</td>
                  <td class="text-center">{{ it.short_name }}</td>
                  <td>{{ it.name_th }}</td>
                  <td>{{ it.name_en }}</td>
                  <td class="text-center">{{ it.campus.name_th }}</td>
                  <td class="text-center">
                    <router-link
                      :to="'/center/' + it.id"
                      class="btn btn-sm btn-primary btn-icon"
                    >
                      <i class="fa fa-edit"></i>
                    </router-link>
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="6">
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
import Datatable from "@/components/kt-datatable/KTDataTable.vue";
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

export default defineComponent({
  name: "center",
  components: {
    Datatable,
    BlogPagination,
    vSelect,
  },
  setup() {
    const router = useRouter();
    const tableHeader = ref([
      {
        columnName: "รหัส",
        columnLabel: "code",
      },
      {
        columnName: "ตัวย่อ",
        columnLabel: "short_name",
      },
      {
        columnName: "ชื่อศูนย์ (TH)",
        columnLabel: "name_th",
      },
      {
        columnName: "ชื่อศูนย์ (EN)",
        columnLabel: "name_en",
      },
      {
        columnName: "วิทยาเขต",
        columnLabel: "campus",
      },
      {
        columnName: "จัดการ",
        columnLabel: "salary",
      },
    ]);

    interface info {
      id: number;
      campus_id: number;
      code: string;
      short_name: string;
      name_th: string;
      name_en: string;
      head_of_center: string;
      is_publish: Number;
      campus: {
        name_th: string;
      };
    }

    const items = ref<Array<info>>([]);

    const perPage = ref<Number>(10);
    const currentPage = ref<Number>(1);
    const totalPage = ref<Number>(1);
    const totalItems = ref<Number>(0);
    const search = ref<any>({
      campus_id: null,
      code: "",
      short_name: "",
      name_th: "",
      name_en: "",
    });

    const selectOptions = ref({
      perPage: [
        { title: "20", value: 20 },
        { title: "40", value: 40 },
        { title: "60", value: 60 },
      ],
      news_types: [],
      campus: [],
    });

    // Fetch
    const fetchCampus = () => {
      ApiService.get("campus")
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          selectOptions.value.campus = data.data;
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
        campus_id: search.value.campus_id
          ? search.value.campus_id.id
          : undefined,
      };
      
      if (userData.group_id != 1) {
        params['id'] = userData.center_id
      }

      ApiService.query("center", { params: params })
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
      fetchCampus();
      fetchItems();
    });

    const userData = JSON.parse(localStorage.getItem("userData"));
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
      userData,
    };
  },
});
</script>
