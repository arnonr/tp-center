<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-12 mb-xl-10">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">ค้นหา</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-lg-4">
              <label for="campus">วิทยาเขต</label>
              <v-select
                label="name_th"
                placeholder="วิทยาเขต"
                :options="selectOptions.campus"
                v-model="search.campus_id"
                class="form-control"
                :clearable="true"
              >
              </v-select>
            </div>

            <div class="col-lg-4">
              <label for="name">รหัส</label>
              <input
                type="text"
                name="txt-search-campus-id"
                id="txt-search-campus-id"
                class="form-control"
                v-model="search.code"
              />
            </div>

            <div class="col-lg-4">
              <label for="name">ตัวย่อ</label>
              <input
                type="text"
                name="txt-search-campus-id"
                id="txt-search-campus-id"
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
        </div>
      </div>

      <div class="card card-table mt-10">
        <div class="card-header">
          <h3 class="card-title">รายการ</h3>

            <div class="card-toolbar">
                <router-link to="/center-new/add" class="btn btn-sm btn-light-success">
                  <i class="fa fa-add"></i> เพิ่มข้อมูล
                </router-link>
            </div>

        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-bordered table-striped">
              <thead>
                <tr>
                  <th class="text-center">รหัส</th>
                  <th class="text-center">ตัวย่อ</th>
                  <th class="text-center">ชื่อศูนย์</th>
                  <th class="text-center">หัวหน้าศูนย์</th>
                  <th class="text-center">เบอร์ติดต่อ</th>
                  <th class="text-center">อีเมล</th>
                  <th class="text-center">ผู้รับผิดชอบ</th>
                  <th class="text-center">วิทยาเขต</th>
                  <th class="text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody v-if="items.length != 0">
                <tr v-for="(it, idx) in items" :key="idx">
                  <td>{{ it.code }}</td>
                  <td>{{ it.short_name }}</td>
                  <td>{{ it.name_th }}</td>
                  <td>{{ it.head_of_center }}</td>
                  <td>{{ it.head_of_center_phone }}</td>
                  <td>{{ it.head_of_center_email }}</td>
                  <td>{{ it.responsible_staff }}</td>
                  <td>{{ it.campus.name_th }}</td>
                  <td>
                    <router-link
                      :to="'/center-new/edit/' + it.id"
                      class="btn btn-sm btn-primary btn-icon"
                    >
                      <i class="fa fa-edit"></i>
                    </router-link>
                  </td>
                </tr>
              </tbody>
              <!-- <tbody v-else>
                <span>ไม่พบข้อมูล</span>
              </tbody> -->
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import ApiService from "@/core/services/ApiService";
import { defineComponent, onMounted, ref, watch } from "vue";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";

export default defineComponent({
  name: "center-new",
  components: {
    vSelect,
    BlogPagination,
  },
  setup() {
    // Variable
    const search = ref<any>({
      campus_id: null,
      code: "",
      short_name: "",
      name_th: "",
      head_of_center: "",
      responsible_staff: "",
    });

    const selectOptions = ref({
      campus: [],
    });

    const items = ref<Array<any>>([]);
    const perPage = ref<Number>(10);
    const currentPage = ref<Number>(1);
    const totalPage = ref<Number>(1);
    const totalItems = ref<Number>(0);

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

      ApiService.query("center", { params: params })
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          //
          items.value = data.data;
          totalPage.value = data.totalPage;
          totalItems.value = data.totalData;
        })
        .catch((response) => {
          console.log(response.data.errors);
        });
    };

    // Watch
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
      search,
      selectOptions,
      totalPage,
      totalItems,
      perPage,
      currentPage,
      items,
    };
  },
});
</script>
