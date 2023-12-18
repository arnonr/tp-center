<template>
  <!--begin::Layout-->
  <div class="d-flex flex-column flex-xl-row">
    <div class="col-md-12 col-lg-12 col-xl-12 col-xxl-12 mb-md-12 mb-xl-10">
      <div class="card shadow-sm card-search mb-10">
        <div class="card-header">
          <h3 class="card-title">แบบฟอร์มข้อมูล</h3>
          <div class="card-toolbar">
            <div class="example-tools justify-content-center">
              <span
                class="example-toggle"
                data-toggle="tooltip"
                title=""
                data-original-title="View code"
              ></span>
              <span
                class="example-copy"
                data-toggle="tooltip"
                title=""
                data-original-title="Copy code"
              ></span>
            </div>
          </div>
        </div>

        <div class="card-body">
          <div class="row" v-if="item">
            <div
              class="form-group row mb-5"
              v-for="(c, idx) in column"
              :key="idx"
            >
              <label class="col-lg-3 col-form-label"
                >{{ c.columnLabel }}:</label
              >
              <div class="col-lg-8">
                <input
                  v-if="c.type == 'text'"
                  type="text"
                  class="form-control"
                  :placeholder="c.columnLabel"
                  v-model="item[c.columnName]"
                  :name="c.columnName"
                />

                <input
                  v-if="c.type == 'number'"
                  type="number"
                  class="form-control"
                  :placeholder="c.columnLabel"
                  v-model="item[c.columnName]"
                  :name="c.columnName"
                />

                <v-select
                  v-if="c.select != null"
                  :label="c.selectLabel"
                  :name="c.columnName"
                  :placeholder="c.columnLabel"
                  :options="selectOptions[c.select]"
                  v-model="item[c.columnName]"
                  class="form-control"
                  :clearable="true"
                ></v-select>

                <VueDatePicker
                  v-if="c.type == 'date'"
                  v-model="item[c.columnName]"
                  :enable-time-picker="false"
                  locale="th"
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

                <input
                  v-if="c.type == 'file'"
                  ref="file"
                  class="form-control"
                  type="file"
                  id="formFile"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <button
            type="button"
            class="btn btn-light-success me-2"
            @click="onValidate()"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>

  <!--end::Layout-->
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import ApiService from "@/core/services/ApiService";
import { useRouter, useRoute } from "vue-router";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import useToast from "@/composables/useToast";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

export default defineComponent({
  name: "project-add-id",
  components: {
    vSelect,
    VueDatePicker,
  },
  setup() {
    const router = useRouter();

    const column = [
      {
        columnName: "name",
        columnLabel: "ชื่อโครงการ",
        type: "text",
      },
      {
        columnName: "center_id",
        columnLabel: "ศูนย์",
        type: "select",
        select: "center",
        selectLabel: "name_th",
      },
      {
        columnName: "project_type_id",
        columnLabel: "ประเภทโครงการ",
        type: "select",
        select: "project_type",
        selectLabel: "name",
      },
      {
        columnName: "budget",
        columnLabel: "งบประมาณ",
        type: "text",
      },
      {
        columnName: "trl",
        columnLabel: "TRL",
        type: "number",
      },
      {
        columnName: "in_organization",
        columnLabel: "หน่วยงาน",
        type: "text",
      },
      {
        columnName: "ex_organization",
        columnLabel: "สถานประกอบการ",
        type: "text",
      },
      {
        columnName: "responsible_staff",
        columnLabel: "ผู้รับผิดชอบ",
        type: "text",
      },
      {
        columnName: "project_date",
        columnLabel: "วันที่",
        type: "date",
      },
      {
        columnName: "file",
        columnLabel: "อัพโหลดไฟล์",
        type: "file",
      },
    ];

    const format = (date) => {
      const day = dayjs(date).locale("th").format("DD");
      const month = dayjs(date).locale("th").format("MMM");
      const year = date.getFullYear() + 543;

      return `${day} ${month} ${year}`;
    };

    const item = ref<any>({
      is_publish: 1,
      project_date: dayjs(),
    });
    const selectOptions = ref<any>({
      center: [],
      project_type: [],
    });

    let schema = yup.object({
      center_id: yup.object().required(),
      project_type_id: yup.object().required(),
      name: yup.string().required(),
      budget: yup.string().required(),
      trl: yup.string().required(),
      in_organization: yup.string().nullable(),
      ex_organization: yup.string().nullable(),
      responsible_staff: yup.string().nullable(),
    });

    // Fetch
    const fetchCenter = () => {
      const params = {
        perPage: 50,
      };

      ApiService.query("user", { params: params })
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

    // Event
    const onValidate = async () => {
      try {
        await schema.validate(item.value);
        onSubmit();
      } catch (error) {
        useToast(error, "error");
      }
    };

    const onSubmit = () => {
      let params = {
        ...item.value,
        project_date: dayjs(item.value.project_date).format("YYYY-MM-DD"),
        center_id: item.value.center_id ? item.value.center_id.id : undefined,
        project_type_id: item.value.project_type_id
          ? item.value.project_type_id.id
          : undefined,
      };

      ApiService.post("project/", params)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }

          useToast("เพิ่มข้อมูลเสร็จสิ้น", "success");

          router.push({ name: "project-id", params: { id: data.id } });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    onMounted(() => {
      fetchCenter();
      fetchProjectType();
    });
    return {
      item,
      column,
      router,
      selectOptions,
      onValidate,
      format,
    };
  },
});
</script>
