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
              class="col-12 col-lg-2"
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

            <div class="col-lg-2">
              <label for="code">รหัส</label>
              <input
                type="text"
                name="txt-search-campus-id"
                id="txt-search-campus-id"
                class="form-control"
                v-model="search.code"
              />
            </div>

            <div class="col-lg-2">
              <label for="short_name">ตัวย่อ</label>
              <input
                type="text"
                name="txt-search-short-name"
                id="txt-search-short-name"
                class="form-control"
                v-model="search.short_name"
              />
            </div>

            <div class="col-lg-6">
              <label for="name_th">ชื่อศูนย์ (TH)</label>
              <input
                type="text"
                name="txt-search-name-th"
                id="txt-search-name-th"
                class="form-control"
                v-model="search.name_th"
              />
            </div>
          </div>

          <div class="row mt-5">
            <div class="col-lg-4">
              <label for="location">สถานที่ตั้ง</label>
              <input
                type="text"
                name="txt-search-location"
                id="txt-search-location"
                class="form-control"
                v-model="search.location"
              />
            </div>
            <div class="col-lg-4">
              <label for="name_en">ชื่อหัวหน้าศูนย์</label>
              <input
                type="text"
                name="txt-search-head_of_center"
                id="txt-search-head_of_center"
                class="form-control"
                v-model="search.head_of_center"
              />
            </div>
            <div class="col-lg-4">
              <label for="name_en">ชื่อผู้รับผิดชอบ</label>
              <input
                type="text"
                name="txt-search-responsible_staff"
                id="txt-search-responsible_staff"
                class="form-control"
                v-model="search.responsible_staff"
              />
            </div>
          </div>
          <div class="row mt-5">
            <div class="col-lg-4">
              <label for="expertise">ความเชี่ยวชาญ</label>
              <input
                type="text"
                name="txt-search-expertise"
                id="txt-search-expertise"
                class="form-control"
                v-model="search.expertise"
              />
            </div>
            <div class="col-lg-4">
              <label for="about">ข้อมูลศูนย์เบื้องต้น</label>
              <input
                type="text"
                name="txt-search-about"
                id="txt-search-about"
                class="form-control"
                v-model="search.about"
              />
            </div>
            <div class="col-lg-4">
              <label for="service">บริการของศูนย์</label>
              <input
                type="text"
                name="txt-search-about"
                id="txt-search-about"
                class="form-control"
                v-model="search.service"
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
                  <td>{{ it.head_of_center }}</td>
                  <td>{{ it.head_of_center_phone }}</td>
                  <td>{{ it.head_of_center_email }}</td>
                  <td>{{ it.responsible_staff }}</td>
                  <td class="text-center">{{ it.campus.name_th }}</td>
                  <td class="text-center">
                    <router-link
                      :to="'/center/' + it.id"
                      class="btn btn-sm btn-primary btn-icon"
                    >
                      <i class="fa fa-eye"></i>
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
        columnName: "หัวหน้าศูนย์",
        columnLabel: "head_of_center",
      },
      {
        columnName: "เบอร์ติดต่อ",
        columnLabel: "head_of_center_phone",
      },
      {
        columnName: "อีเมล",
        columnLabel: "head_of_center_email",
      },
      {
        columnName: "ผู้รับผิดชอบ",
        columnLabel: "responsible_staff",
      },
      {
        columnName: "วิทยาเขต",
        columnLabel: "campus",
      },
      {
        columnName: "ดูข้อมูล",
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
      head_of_center_phone: string;
      head_of_center_email: string;
      responsible_staff: string;
      is_publish: Number;
      location: String;
      expertise: string;
      about: string;
      service: string;
      campus: {
        name_th: string;
      };
    }

    const items = ref<Array<info>>([]);
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

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
      location: "",
      about: "",
      service: "",
      expertise: "",
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
        params["id"] = userData.center_id;
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
