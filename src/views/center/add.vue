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

                <v-select
                  v-if="c.type == 'select'"
                  label="name_th"
                  :name="c.columnName"
                  placeholder="วิทยาเขต"
                  :options="selectOptions.campus"
                  v-model="item[c.columnName]"
                  class="form-control"
                  :clearable="true"
                ></v-select>

                <textarea
                  v-if="c.type == 'textarea'"
                  type="text"
                  class="form-control"
                  rows="10" 
                  :placeholder="c.columnLabel"
                  v-model="item[c.columnName]"
                  :name="c.columnName"
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
          <!-- <button type="button" class="btn btn-secondary">Cancel</button> -->
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

export default defineComponent({
  name: "center-add-id",
  components: {
    vSelect,
  },
  setup() {
    const router = useRouter();

    const column = [
      {
        columnName: "code",
        columnLabel: "รหัสศูนย์",
        type: "text",
      },
      {
        columnName: "short_name",
        columnLabel: "ตัวย่อศูนย์",
        type: "text",
      },
      {
        columnName: "name_th",
        columnLabel: "ชื่อศูนย์ (TH)",
        type: "text",
      },
      {
        columnName: "name_en",
        columnLabel: "ชื่อศูนย์ (EN)",
        type: "text",
      },
      {
        columnName: "campus_id",
        columnLabel: "วิทยาเขต",
        type: "select",
      },
      {
        columnName: "location",
        columnLabel: "สถานที่ตั้ง",
        type: "text",
      },
      {
        columnName: "head_of_center",
        columnLabel: "หัวหน้าศูนย์",
        type: "text",
      },
      {
        columnName: "head_of_center_phone",
        columnLabel: "เบอร์ติดต่อ (หัวหน้าศูนย์)",
        type: "text",
      },
      {
        columnName: "head_of_center_email",
        columnLabel: "อีเมล (หัวหน้าศูนย์)",
        type: "text",
      },
      {
        columnName: "responsible_staff",
        columnLabel: "ผู้รับผิดชอบ (สำนักงานอำนวยการ)",
        type: "text",
      },
      {
        columnName: "responsible_phone",
        columnLabel: "เบอร์โทรศัพท์ ผู้รับผิดชอบ",
        type: "text",
      },
      {
        columnName: "responsible_email",
        columnLabel: "อีเมล ผู้รับผิดชอบ",
        type: "text",
      },
      {
        columnName: "expertise",
        columnLabel: "ความเชี่ยวชาญ",
        type: "textarea",
      },
      {
        columnName: "about",
        columnLabel: "ข้อมูลเบื้องต้นของศูนย์",
        type: "textarea",
      },
      {
        columnName: "service",
        columnLabel: "บริการของศูนย์",
        type: "textarea",
      },
      {
        columnName: "website",
        columnLabel: "Website / Facebook Fanpage",
        type: "textarea",
      },
      {
        columnName: "gallery_image_url",
        columnLabel: "ลิงค์รูปภาพ (Google Drive or OneDrive)",
        type: "text",
      },
    ];

    interface info {
      campus_id: any;
      code: string;
      short_name: string;
      name_th: string;
      name_en: string;
      head_of_center: string;
      head_of_center_phone: string;
      head_of_center_email: string;
      is_publish: Number;
      responsible_staff: string;
      responsible_phone: string;
      responsible_email: string;
      expertise: string;
      about: string;
      location: string;
      service: string;
      website: string;
      gallery_image_url: string;
    }

    const item = ref<info>({
      campus_id: null,
      code: "",
      short_name: "",
      name_th: "",
      name_en: "",
      head_of_center: "",
      head_of_center_phone: "",
      head_of_center_email: "",
      responsible_staff: "",
      responsible_phone: "",
      responsible_email: "",
      is_publish: 1,
      expertise: "",
      about: "",
      location: "",
      service: "",
      website: "",
      gallery_image_url: "",
    });
    const selectOptions = ref<any>({
      campus: [],
    });

    let schema = yup.object({
      campus_id: yup.object().required(),
      code: yup.string().required(),
      short_name: yup.string().required(),
      name_th: yup.string().required(),
      name_en: yup.string().nullable(),
      head_of_center: yup.string().nullable(),
      head_of_center_phone: yup.string().nullable(),
      head_of_center_email: yup.string().nullable(),
      responsible_staff: yup.string().nullable(),
      responsible_phone: yup.string().nullable(),
      responsible_email: yup.string().nullable(),
      expertise: yup.string().nullable(),
      about: yup.string().nullable(),
      location: yup.string().nullable(),
      service: yup.string().nullable(),
      website: yup.string().nullable(),
      gallery_image_url: yup.string().nullable(),
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
        campus_id: item.value.campus_id ? item.value.campus_id.id : undefined,
      };

      ApiService.post("center/", params)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }

          useToast("เพิ่มข้อมูลเสร็จสิ้น", "success");

          router.push({ name: "center-id", params: { id: data.id } });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    onMounted(() => {
      fetchCampus();
    });
    return {
      item,
      column,
      router,
      selectOptions,
      onValidate,
    };
  },
});
</script>
