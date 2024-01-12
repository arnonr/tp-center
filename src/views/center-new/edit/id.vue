<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="col-md-12">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">แบบฟอร์มข้อมูล</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="form-group row mb-5">
              <label for="code" class="col-lg-3 col-form-label"
                >รหัสศูนย์</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="code"
                  placeholder="รหัสศูนย์"
                  v-model="item.code"
                />
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="short_name" class="col-lg-3 col-form-label"
                >ตัวย่อศูนย์</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="short_name"
                  placeholder="ตัวย่อศูนย์"
                  v-model="item.short_name"
                />
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="name_th" class="col-lg-3 col-form-label"
                >ชื่อศูนย์ (TH)</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="name_th"
                  placeholder="ชื่อศูนย์ TH"
                  v-model="item.name_th"
                />
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="name_en" class="col-lg-3 col-form-label"
                >ชื่อศูนย์ (EN)</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="name_en"
                  placeholder="ชื่อศูนย์ EN"
                  v-model="item.name_en"
                />
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="campus_id" class="col-lg-3 col-form-label"
                >วิทยาเขต</label
              >
              <div class="col-lg-8">
                <v-select
                  label="name_th"
                  name="campus_id"
                  placeholder="วิทยาเขต"
                  :options="selectOptions.campus"
                  class="form-control"
                  :clearable="false"
                  v-model="item.campus_id"
                >
                </v-select>
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="head_of_center" class="col-lg-3 col-form-label"
                >หัวหน้าศูนย์</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="head_of_center"
                  placeholder="หัวหน้าศูนย์"
                  v-model="item.head_of_center"
                />
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="head_of_center_phone" class="col-lg-3 col-form-label"
                >เบอร์ติดต่อ (หัวหน้าศูนย์)</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="head_of_center_phone"
                  placeholder="เบอร์ติดต่อ (หัวหน้าศูนย์)"
                  v-model="item.head_of_center_phone"
                />
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="head_of_center_email" class="col-lg-3 col-form-label"
                >อีเมล (หัวหน้าศูนย์)</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="head_of_center_email"
                  placeholder="อีเมล (หัวหน้าศูนย์)"
                  v-model="item.head_of_center_email"
                />
              </div>
            </div>
            <!--  -->

            <div class="form-group row mb-5">
              <label for="responsible_staff" class="col-lg-3 col-form-label"
                >ผู้รับผิดชอบ (สำนักงานอำนวยการ)</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="responsible_staff"
                  placeholder="ผู้รับผิดชอบ (สำนักงานอำนวยการ)"
                  v-model="item.responsible_staff"
                />
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="responsible_phone" class="col-lg-3 col-form-label"
                >เบอร์โทรศัพท์ ผู้รับผิดชอบ</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="responsible_phone"
                  placeholder="เบอร์โทรศัพท์ ผู้รับผิดชอบ"
                  v-model="item.responsible_phone"
                />
              </div>
            </div>

            <div class="form-group row mb-5">
              <label for="responsible_email" class="col-lg-3 col-form-label"
                >อีเมล ผู้รับผิดชอบ</label
              >
              <div class="col-lg-8">
                <input
                  type="text"
                  class="form-control"
                  id="responsible_email"
                  placeholder="อีเมล ผู้รับผิดชอบ"
                  v-model="item.responsible_email"
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
            บันทึก
          </button>
        </div>
      </div>
    </div>
  </div>
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
  name: "center-news-edit-id",
  components: {
    vSelect,
  },
  setup() {
    // Variable

    const router = useRouter();

    const item = ref<any>({
      code: "",
      short_name: "",
      name_th: "",
      name_en: "",
      campus_id: null,
      head_of_center: "",
      head_of_center_phone: "",
      head_of_center_email: "",
      responsible_staff: "",
      responsible_phone: "",
      responsible_email: "",
      is_publish: 1,
    });

    const selectOptions = ref<any>({
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

    const fetchItem = () => {
      ApiService.get(`center/${useRoute().params.id}`)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }
          item.value = data.data;
          item.value.campus_id = selectOptions.value.campus.find((x: any) => {
            return x.id == item.value.campus_id;
          });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    onMounted(() => {
      fetchCampus();
      fetchItem();
    });

    // Event
    const onValidate = () => {
      console.log(item.value);

      if (item.value.name_th == "") {
        useToast("กรุณากรอกชื่อศูนย์", "error");
        return;
      }

      if (item.value.head_of_center_email == "") {
        useToast("กรุณากรอกอีเมล", "error");
        return;
      }

      onSubmit();
    };

    const onSubmit = () => {
      let params = {
        ...item.value,
        campus_id: item.value.campus_id ? item.value.campus_id.id : undefined,
      };

      ApiService.put("center/" + item.value.id, params)
        .then(({ data }) => {
          if (data.msg != "success") {
            throw new Error("ERROR");
          }

          useToast("แก้ไขข้อมูลเสร็จสิ้น", "success");

          router.push({ name: "center-new" });
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };

    return {
      item,
      selectOptions,
      onValidate,
    };
  },
});
</script>
