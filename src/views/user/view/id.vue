<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-xl-row">
    <div class="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-12 mb-xl-10">
      <div class="card shadow-sm card-search mb-10">
        <div class="card-body">
          <div class="row" v-if="item">
            <div class="col-lg-12 text-end mb-5">
              <router-link
                :to="'/project/edit/' + item.id"
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
              <h3><i class="fas fa-rocket text-dark"></i> {{ item.name }}</h3>
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
                    : c.type == "date"
                    ? dayjs(item[c.columnName.split(".")[0]]).locale("th").format("DD MMM BB")
                    : item[c.columnName]

                }}
              </span>
              <div class="separator my-5"></div>
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
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default defineComponent({
  name: "project-id",
  components: {},
  setup() {
    const router = useRouter();
    const route = useRoute();

    const column = [
      {
        columnName: "name",
        columnLabel: "ชื่อโครงการ",
        type: null,
      },
      {
        columnName: "center.name_th",
        columnLabel: "ศูนย์",
        type: "relation1",
      },
      {
        columnName: "project_type.name",
        columnLabel: "ประเภทโครงการ",
        type: "relation1",
      },
      {
        columnName: "budget",
        columnLabel: "งบประมาณ",
        type: null,
      },
      {
        columnName: "trl",
        columnLabel: "TRL",
        type: null,
      },
      {
        columnName: "in_organization",
        columnLabel: "หน่วยงาน",
        type: null,
      },
      {
        columnName: "ex_organization",
        columnLabel: "สถานประกอบการ",
        type: null,
      },
      {
        columnName: "responsible_staff",
        columnLabel: "ผู้รับผิดชอบ",
        type: null,
      },
      {
        columnName: "project_date",
        columnLabel: "วันที่",
        type: "date",
      },
    ];

    // Variable Data
    const item = ref<any>();

    // Fetch
    const fetchProject = () => {
      ApiService.get("project/" + route.params.id)
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
      ApiService.delete("project/" + id)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          useToast("ลบรายการเสร็จสิ้น", "success");
          router.push({ name: "project" });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    onMounted(() => {
      fetchProject();
    });

    return {
      item,
      column,
      router,
      onConfirmDelete,
      dayjs,
    };
  },
});
</script>
