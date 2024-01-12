<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-xl-row">
    <div class="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-12 mb-xl-10">
      <div class="card shadow-sm card-search mb-10">
        <div class="card-body">
          <div class="row" v-if="item">
            <div class="col-lg-12 text-end mb-5">
              <router-link
                :to="'/center/edit/' + item.id"
                class="btn btn-light-success me-5"
              >
                <i class="fa fa-edit"></i> แก้ไข
              </router-link>

              <button
                class="btn btn-light-danger"
                @click="onConfirmDelete(item.id)"
              >
                <i class="fa fa-trash"></i>
                ลบ
              </button>
            </div>
            <div class="col-lg-12 pl-5 pt-5 pb-3 bg-secondary mb-10">
              <h3>
                <i class="fas fa-rocket text-dark"></i> {{ item.name_th }}
              </h3>
            </div>

            <div class="col-lg-12" v-for="(c, idx) in column" :key="idx">
              <span class="fw-bold text-dark">{{ c.columnLabel }} : </span>
              <span class="text-primary fw-bold">
                {{
                  c.type == "relation1"
                    ? item[c.columnName.split(".")[0]][
                        c.columnName.split(".")[1]
                      ]
                    : c.type == "relation2"
                    ? item[c.columnName.split(".")[0]][
                        c.columnName.split(".")[1]
                      ][c.columnName.split(".")[2]]
                    : item[c.columnName]
                }}
              </span>
              <div class="separator my-5"></div>
            </div>

            <div class="card shadow-sm card-table">
              <div class="card-header">
                <h3 class="card-title">บุคลากร</h3>

                <div class="card-toolbar">
                  <!-- data-bs-toggle="modal"
                    data-bs-target="#kt_modal_1" -->
                  <button
                    type="button"
                    class="btn btn-sm btn-light-success"
                    @click="
                      () => {
                        administrator = {};
                        state.modalForm.show();
                      }
                    "
                  >
                    <i class="fa fa-add"></i> เพิ่มบุคลากร
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
                    <tbody v-if="administrators.length != 0">
                      <tr v-for="(it, idx) in administrators" :key="idx">
                        <td class="text-center">
                          {{ it.prefix + it.firstname + " " + it.surname }}
                        </td>
                        <td class="text-center">{{ it.position }}</td>
                        <td class="text-center">{{ it.phone }}</td>
                        <td class="text-center">{{ it.email }}</td>
                        <td class="text-center">
                          <button class="btn btn-sm btn-primary btn-icon">
                            <i
                              class="fa fa-edit"
                              @click="
                                () => {
                                  administrator = { ...it };
                                  state.modalForm.show();
                                }
                              "
                            ></i>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td colspan="6">
                          <div class="text-center">
                            <span>ไม่พบข้อมูล</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Administrator -->
      <div class="modal fade" id="modal-form">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title">แบบฟอร์มบุคลากร</h3>

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
                <div
                  class="form-group row mb-5"
                  v-for="(c, idx) in columnAdministrator"
                  :key="idx"
                >
                  <div class="col-lg-12">
                    <label class="label">{{ c.columnLabel }}</label>
                    <input
                      v-if="c.type == 'text'"
                      type="text"
                      class="form-control"
                      :placeholder="c.columnLabel"
                      v-model="administrator[c.columnName]"
                      :name="c.columnName"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-light"
                data-bs-dismiss="modal"
              >
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
  </div>

  <!--end::Layout-->
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter, useRoute } from "vue-router";
import Swal from "sweetalert2";
import useToast from "@/composables/useToast";
import * as yup from "yup";
import * as bootstrap from "bootstrap";
export default defineComponent({
  name: "center-id",
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();

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

    const column = [
      {
        columnName: "code",
        columnLabel: "รหัสศูนย์",
        type: null,
      },
      {
        columnName: "short_name",
        columnLabel: "ตัวย่อศูนย์",
        type: null,
      },
      {
        columnName: "name_th",
        columnLabel: "ชื่อศูนย์ (TH)",
        type: null,
      },
      {
        columnName: "name_en",
        columnLabel: "ชื่อศูนย์ (EN)",
        type: null,
      },
      {
        columnName: "campus.name_th",
        columnLabel: "วิทยาเขต",
        type: "relation1",
      },
      {
        columnName: "location",
        columnLabel: "ที่ตั้ง",
        type: null,
      },
      {
        columnName: "head_of_center",
        columnLabel: "หัวหน้าศูนย์",
        type: null,
      },
      {
        columnName: "head_of_center_phone",
        columnLabel: "เบอร์ติดต่อ (หัวหน้าศูนย์)",
        type: null,
      },
      {
        columnName: "head_of_center_email",
        columnLabel: "อีเมล (หัวหน้าศูนย์)",
        type: null,
      },
      {
        columnName: "responsible_staff",
        columnLabel: "ผู้รับผิดชอบ (สำนักงานอำนวยการ)",
        type: null,
      },
      {
        columnName: "responsible_phone",
        columnLabel: "เบอร์ติดต่อ (ผู้รับผิดชอบ)",
        type: null,
      },
      {
        columnName: "responsible_email",
        columnLabel: "อีเมล (ผู้รับผิดชอบ)",
        type: null,
      },
      {
        columnName: "expertise",
        columnLabel: "ความเชี่ยวชาญ",
        type: null,
      },
      {
        columnName: "about",
        columnLabel: "ข้อมูลเบื้องต้น",
        type: null,
      },
      {
        columnName: "service",
        columnLabel: "บริการของศูนย์",
        type: null,
      },

      {
        columnName: "website",
        columnLabel: "Website / Facebook",
        type: null,
      },


      {
        columnName: "gallery_image_url",
        columnLabel: "รูปเครื่องมือหรือรูปที่เกี่ยวข้องศูนย์ปฏิบัติการ",
        type: null,
      },
    ];

    // Variable Data
    const state = reactive<any>({
      modalForm: null,
    });
    const item = ref<any>();
    const administrators = ref<any>([]);
    const tableHeader = ref([
      {
        columnName: "ชื่อ-นามสกุล",
        columnLabel: "name",
      },
      {
        columnName: "ตำแหน่ง",
        columnLabel: "position",
      },
      {
        columnName: "เบอร์ติดต่อ",
        columnLabel: "phone",
      },
      {
        columnName: "อีเมล",
        columnLabel: "email",
      },
      {
        columnName: "จัดการ",
        columnLabel: "manage",
      },
    ]);
    const administrator = ref<any>({});
    let schema = yup.object({
      prefix: yup.string().required(),
      firstname: yup.string().required(),
      surname: yup.string().required(),
      position: yup.string().required(),
      phone: yup.string(),
      email: yup.string(),
    });
    const columnAdministrator = [
      {
        columnName: "prefix",
        columnLabel: "คำนำหน้า",
        type: "text",
      },
      {
        columnName: "firstname",
        columnLabel: "ชื่อ",
        type: "text",
      },
      {
        columnName: "surname",
        columnLabel: "นามสกุล",
        type: "text",
      },
      {
        columnName: "position",
        columnLabel: "ตำแหน่ง",
        type: "text",
      },
      {
        columnName: "phone",
        columnLabel: "เบอร์ติดต่อ",
        type: "text",
      },
      {
        columnName: "email",
        columnLabel: "อีเมล",
        type: "text",
      },
    ];

    // Fetch
    const fetchCenter = () => {
      ApiService.get("center/" + route.params.id)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          item.value = data.data;
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    const fetchAdministrator = () => {
      ApiService.query("administrator/", {
        params: { center_id: route.params.id },
      })
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          administrators.value = data.data;
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };
    
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
      ApiService.delete("center/" + id)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          useToast("ลบรายการเสร็จสิ้น", "success");
          router.push({ name: "center" });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    // Administrator
    const onValidate = async () => {
      try {
        console.log(administrator.value);
        await schema.validate(administrator.value);
        onSubmit();
      } catch (error) {
        useToast(error, "error");
      }
    };

    const onSubmit = () => {
      let params = {
        ...administrator.value,
        center_id: item.value.id,
        is_publish: 1,
      };

      let api = {
        type: "post",
        url: "administrator/",
        textToast: "เพิ่มข้อมูลเสร็จสิ้น",
      };

      if (administrator.value.id != undefined) {
        api = {
          type: "put",
          url: "administrator/" + administrator.value.id,
          textToast: "แก้ไขข้อมูลเสร็จสิ้น",
        };
      }
      ApiService[api.type](api.url, params)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          state.modalForm.hide();
          fetchAdministrator();
          useToast(api.textToast, "success");

          router.push({ name: "center-id", params: { id: item.value.id } });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    onMounted(() => {
      state.modalForm = new bootstrap.Modal("#modal-form", {});
      fetchCenter();
      fetchAdministrator();
    });

    return {
      item,
      administrators,
      column,
      columnAdministrator,
      tableHeader,
      router,
      onConfirmDelete,
      administrator,
      onValidate,
      state,
    };
  },
});
</script>
