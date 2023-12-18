<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-xl-row">
    <div class="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-12 mb-xl-10">
      <div class="card shadow-sm card-search mb-10">
        <div class="card-header">
          <h3 class="card-title">ค้นหางานทดสอบ/ตรวจสอบ</h3>
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
              <label for="ex_code">เลขงานทดสอบ/ตรวจสอบ</label>
              <input
                type="text"
                name="txt-code"
                id="txt-search-code"
                class="form-control"
                v-model="search.code"
              />
            </div>

            <div
              class="col-12 col-lg-6 mt-3"
              v-if="selectOptions.center.length != 0"
            >
              <label for="campus_id">ประเภทงาน</label>
              <v-select
                label="name"
                placeholder="ประเภทงาน"
                :options="selectOptions.type"
                v-model="search.type"
                class="form-control"
                :clearable="true"
              ></v-select>
            </div>

            <div class="col-12 col-lg-6 mt-3">
              <label for="company_name">สถานประกอบการ</label>
              <input
                type="text"
                name="txt-code"
                id="txt-company-name"
                class="form-control"
                v-model="search.company_name"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm card-table">
        <div class="card-header">
          <h3 class="card-title">รายการ</h3>

          <div class="card-toolbar">
            <button
              class="btn btn-sm btn-light-success"
              @click="
                () => {
                  item = {};
                  file = null;
                  state.modalForm.show();
                }
              "
            >
              <i class="fa fa-add"></i> ออกเลข
            </button>
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
                  <td class="text-center">{{ it.name }}</td>
                  <td class="text-center">
                    {{ useBasicData().types[it.type - 1].name }}
                  </td>
                  <td class="text-center">{{ it.center.name_th }}</td>
                  <td class="text-center">{{ it.company_name }}</td>
                  <td class="text-center">
                    <a :href="it.inspection_file" target="_blank"
                      ><button class="btn btn-sm btn-icon btn-success">
                        <i class="fa fa-file"></i>
                      </button>
                    </a>
                  </td>
                  <td class="text-center">
                    {{
                      dayjs(it.inspection_date).locale("th").format("DD MMM BB")
                    }}
                  </td>
                  <td class="text-center">
                    <button
                      class="btn btn-sm btn-primary btn-icon"
                      @click="
                        () => {
                          item = { ...it };
                          item.center_id = selectOptions.center.find((x) => {
                            return x['id'] == it.center_id;
                          });

                          item.type = selectOptions.type.find((x) => {
                            return x.value == it.type;
                          });

                          file = null;
                          state.modalForm.show();
                        }
                      "
                    >
                      <i class="fa fa-edit"></i>
                    </button>

                    <button
                      class="btn btn-sm btn-danger btn-icon ms-2"
                      @click="onConfirmDelete(it.id)"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
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

    <!-- Modal Administrator -->
    <div class="modal fade" id="modal-form">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">แบบฟอร์มออกเลขงานทดสอบ/ตรวจสอบ</h3>

            <!--begin::Close-->
            <div
              class="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="ki-duotone ki-cross fs-1"
                ><span class="path1"></span><span class="path2"></span
              ></i>
            </div>
            <!--end::Close-->
          </div>

          <div class="modal-body">
            <div class="row">
              <div class="form-group row mb-5">
                <div class="col-lg-12">
                  <label class="label">ศูนย์</label>
                  <v-select
                    label="name_th"
                    placeholder="เลือกศูนย์"
                    :options="selectOptions.center"
                    v-model="item.center_id"
                    class="form-control"
                    :clearable="true"
                  ></v-select>
                </div>
                <div class="col-lg-12 mt-5">
                  <label class="label">ประเภทงาน</label>
                  <v-select
                    label="name"
                    placeholder="ประเภทงาน"
                    :options="selectOptions.type"
                    v-model="item.type"
                    class="form-control"
                    :clearable="true"
                  ></v-select>
                </div>
                <div class="col-lg-12 mt-5">
                  <label class="label">ชื่องาน</label>
                  <input
                    type="text"
                    name="txt-name"
                    id="txt-name"
                    class="form-control"
                    v-model="item.name"
                  />
                </div>
                <div class="col-lg-12 mt-5">
                  <label class="label">สถานประกอบการ</label>
                  <input
                    type="text"
                    name="txt-company-name"
                    id="txt-company-name"
                    class="form-control"
                    v-model="item.company_name"
                  />
                </div>

                <div class="col-lg-12 mt-5">
                  <label class="label">วันที่ออกรายงาน</label>
                  <VueDatePicker
                    v-model="item.inspection_date"
                    :enable-time-picker="false"
                    :locale="'th'"
                    auto-apply
                    :format="format"
                  >
                    <template #year-overlay-value="{ text }">
                      {{ parseInt(text) + 543 }}
                    </template>

                    <template #year="{ value }">
                      {{ value + 543 }}
                    </template>
                  </VueDatePicker>
                </div>

                <div class="col-lg-12 mt-5">
                  <label class="label">ไฟล์</label>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    ref="file"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Close
            </button>
            <button
              type="button"
              class="btn btn-light-success me-2"
              @click="onValidate"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--end::Layout-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, reactive } from "vue";
import BlogPagination from "@/components/common/pagination/BlogPagination.vue";
import ApiService from "@/core/services/ApiService";
import { useRouter } from "vue-router";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
import * as bootstrap from "bootstrap";
import * as yup from "yup";
import Swal from "sweetalert2";
import useToast from "@/composables/useToast";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import useBasicData from "@/composables/useBasicData";

export default defineComponent({
  name: "project",
  components: {
    BlogPagination,
    vSelect,
    VueDatePicker,
  },
  setup() {
    const router = useRouter();

    // Variable Data
    const state = reactive<any>({
      modalForm: null,
    });

    const format = (date: any) => {
      const day = dayjs(date).locale("th").format("DD");
      const month = dayjs(date).locale("th").format("MMM");
      const year = date.getFullYear() + 543;
      return `${day} ${month} ${year}`;
    };

    const tableHeader = ref([
      {
        columnName: "เลข",
        columnLabel: "code",
      },
      {
        columnName: "ชื่องานทดสอบ/ตรวจสอบ",
        columnLabel: "name",
      },
      {
        columnName: "ประเภท",
        columnLabel: "type",
      },
      {
        columnName: "ชื่อศูนย์",
        columnLabel: "center",
      },
      {
        columnName: "สถานประกอบการ",
        columnLabel: "company_name",
      },
      {
        columnName: "ไฟล์",
        columnLabel: "inspection_file",
      },
      {
        columnName: "วันที่",
        columnLabel: "inspection_date",
      },
      {
        columnName: "จัดการ",
        columnLabel: "manage",
      },
    ]);

    const items = ref<any>([]);
    const file = ref<any>(null);
    const item = ref<any>({});
    const perPage = ref<Number>(10);
    const currentPage = ref<Number>(1);
    const totalPage = ref<Number>(1);
    const totalItems = ref<Number>(0);
    const search = ref<any>({});
    const selectOptions = ref({
      perPage: [
        { title: "20", value: 20 },
        { title: "40", value: 40 },
        { title: "60", value: 60 },
      ],
      center: [],
      project: [],
      type: [
        {
          name: "Report",
          value: 1,
        },
        {
          name: "Certificate",
          value: 2,
        },
      ],
    });
    let schema = yup.object({
      center_id: yup.object().required(),
      type: yup.object().required(),
      //   inspection_date: yup.date().required(),
    });

    // Fetch
    const fetchCenter = () => {
      let params = { perPage: 50 };

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

    const fetchProject = () => {
      let params = {
        project_type_id: 2,
      };
      ApiService.query("project", { params: params })
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          selectOptions.value.project = data.data;
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
        center_id: search.value.center_id
          ? search.value.center_id.id
          : undefined,
        type: search.value.type ? search.value.type.value : undefined,
      };

      if (userData.group_id != 1) {
        params["center_id"] = userData.center_id;
      }

      ApiService.query("inspection", { params: params })
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
    // Event
    const onConfirmDelete = async (id: number) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Cancel it!",
      }).then((result) => {
        if (result.isConfirmed) {
          onDelete(id);
        }
      });
    };

    const onDelete = async (id: number) => {
      ApiService.delete("inspection/" + id)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          fetchItems();
          useToast("ลบรายการเสร็จสิ้น", "success");
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    const onValidate = async () => {
      try {
        await schema.validate(item.value);

        if (!item.value.id) {
          if (file.value == null) {
            useToast("โปรดอัพโหลดไฟล์", "error");
            return;
          }
        }

        onSubmit();
      } catch (error) {
        useToast(error, "error");
      }
    };

    const onSubmit = () => {
      let params = {
        ...item.value,
        inspection_file: file.value.files != null ? file.value.files[0] : null,
        center_id:
          item.value.center_id != null ? item.value.center_id.id : undefined,
        type: item.value.type != null ? item.value.type.value : undefined,
        inspection_date:
          item.value.inspection_date != null
            ? dayjs(item.value.inspection_date).format("YYYY-MM-DD")
            : undefined,
        is_publish: 1,
      };

      let api = {
        type: "postFormData",
        url: "inspection/",
        textToast: "เพิ่มข้อมูลเสร็จสิ้น",
      };

      if (item.value.id != undefined) {
        api = {
          type: "putFormData",
          url: "inspection/" + item.value.id,
          textToast: "แก้ไขข้อมูลเสร็จสิ้น",
        };
      }
      ApiService[api.type](api.url, params)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          state.modalForm.hide();
          fetchItems();
          useToast(api.textToast, "success");
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    // Mounted
    onMounted(() => {
      state.modalForm = new bootstrap.Modal("#modal-form", {});
      fetchCenter();
      fetchProject();
      fetchItems();
    });

    const userData = JSON.parse(localStorage.getItem("userData") || "{}");

    return {
      tableHeader,
      totalPage,
      totalItems,
      search,
      items,
      item,
      perPage,
      currentPage,
      selectOptions,
      router,
      dayjs,
      onValidate,
      onConfirmDelete,
      state,
      format,
      file,
      userData,
      useBasicData,
    };
  },
});
</script>
