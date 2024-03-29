import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/center",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/center",
        name: "center",
        component: () => import("@/views/center/index.vue"),
        meta: {
          pageTitle: "ศูนย์ปฏิบัติการ",
          breadcrumbs: ["ศูนย์ปฏิบัติการ"],
        },
      },
      {
        path: "/center/add/",
        name: "center-add",
        component: () => import("@/views/center/add.vue"),
        meta: {
          pageTitle: "ข้อมูลศูนย์ปฏิบัติการ",
          breadcrumbs: ["รายการศูนย์ปฏิบัติการ", "ข้อมูลศูนย์ปฏิบัติการ"],
        },
      },
      {
        path: "/center/:id",
        name: "center-id",
        component: () => import("@/views/center/view/id.vue"),
        meta: {
          pageTitle: "ข้อมูลศูนย์ปฏิบัติการ",
          breadcrumbs: ["รายการศูนย์ปฏิบัติการ", "ข้อมูลศูนย์ปฏิบัติการ"],
        },
      },
      {
        path: "/center/edit/:id",
        name: "center-edit-id",
        component: () => import("@/views/center/edit/id.vue"),
        meta: {
          pageTitle: "ข้อมูลศูนย์ปฏิบัติการ",
          breadcrumbs: ["รายการศูนย์ปฏิบัติการ", "แก้ไขศูนย์ปฏิบัติการ"],
        },
      },
      //   project
      {
        path: "/project",
        name: "project",
        component: () => import("@/views/project/index.vue"),
        meta: {
          pageTitle: "โครงการ",
          breadcrumbs: ["โครงการ"],
        },
      },
      {
        path: "/project/add/",
        name: "project-add",
        component: () => import("@/views/project/add.vue"),
        meta: {
          pageTitle: "ข้อมูลโครงการ",
          breadcrumbs: ["รายการโครงการ", "ข้อมูลโครงการ"],
        },
      },
      {
        path: "/project/edit/:id",
        name: "project-edit-id",
        component: () => import("@/views/project/edit/id.vue"),
        meta: {
          pageTitle: "ข้อมูลโครงการ",
          breadcrumbs: ["รายการโครงการ", "ข้อมูลโครงการ"],
        },
      },
      {
        path: "/project/:id",
        name: "project-id",
        component: () => import("@/views/project/view/id.vue"),
        meta: {
          pageTitle: "ข้อมูลโครงการ",
          breadcrumbs: ["รายการโครงการ", "ข้อมูลโครงการ"],
        },
      },
      //   inspection
      {
        path: "/inspection",
        name: "inspection",
        component: () => import("@/views/inspection/index.vue"),
        meta: {
          pageTitle: "ออกเลขงานทดสอบ/ตรวจสอบ",
          breadcrumbs: ["ออกเลขงานทดสอบ/ตรวจสอบ"],
        },
      },
      {
        path: "/inspection/add/",
        name: "inspection-add",
        component: () => import("@/views/inspection/add.vue"),
        meta: {
          pageTitle: "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          breadcrumbs: [
            "รายการออกเลขงานทดสอบ/ตรวจสอบ",
            "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          ],
        },
      },
      {
        path: "/inspection/edit/:id",
        name: "inspection-edit-id",
        component: () => import("@/views/inspection/edit/id.vue"),
        meta: {
          pageTitle: "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          breadcrumbs: [
            "รายการออกเลขงานทดสอบ/ตรวจสอบ",
            "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          ],
        },
      },
      {
        path: "/inspection/:id",
        name: "inspection-id",
        component: () => import("@/views/inspection/view/id.vue"),
        meta: {
          pageTitle: "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          breadcrumbs: [
            "รายการออกเลขงานทดสอบ/ตรวจสอบ",
            "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          ],
        },
      },
      //   user
      {
        path: "/user",
        name: "user",
        component: () => import("@/views/user/index.vue"),
        meta: {
          pageTitle: "จัดการผู้ใช้งาน",
          breadcrumbs: ["จัดการผู้ใช้งาน"],
        },
      },
      {
        path: "/inspection/add/",
        name: "inspection-add",
        component: () => import("@/views/inspection/add.vue"),
        meta: {
          pageTitle: "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          breadcrumbs: [
            "รายการออกเลขงานทดสอบ/ตรวจสอบ",
            "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          ],
        },
      },
      {
        path: "/inspection/edit/:id",
        name: "inspection-edit-id",
        component: () => import("@/views/inspection/edit/id.vue"),
        meta: {
          pageTitle: "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          breadcrumbs: [
            "รายการออกเลขงานทดสอบ/ตรวจสอบ",
            "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          ],
        },
      },
      {
        path: "/inspection/:id",
        name: "inspection-id",
        component: () => import("@/views/inspection/view/id.vue"),
        meta: {
          pageTitle: "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          breadcrumbs: [
            "รายการออกเลขงานทดสอบ/ตรวจสอบ",
            "ข้อมูลออกเลขงานทดสอบ/ตรวจสอบ",
          ],
        },
      },
      {
        path: "/center-new",
        name: "center-new",
        component: () => import("@/views/center-new/index.vue"),
        meta: {
          pageTitle: "ศูนย์ปฏิบัติการใหม่",
          breadcrumbs: ["รายการศูนย์ปฏิบัติการ"],
        },
      },
      {
        path: "/center-new/add/",
        name: "center-new-add",
        component: () => import("@/views/center-new/add.vue"),
        meta: {
          pageTitle: "เพิ่มศูนย์ปฏิบัติการใหม่",
          breadcrumbs: ["รายการศูนย์ปฏิบัติการ", "ข้อมูลศูนย์ปฏิบัติการใหม่"],
        },
      },
      {
        path: "/center-new/edit/:id",
        name: "center-new-edit-id",
        component: () => import("@/views/center-new/edit/id.vue"),
        meta: {
          pageTitle: "แก้ไขศูนย์ปฏิบัติการใหม่",
          breadcrumbs: ["รายการศูนย์ปฏิบัติการ", "ข้อมูลศูนย์ปฏิบัติการใหม่"],
        },
      },
    ],
  },
  {
    path: "/",
    redirect: "/dashboard",
    component: () => import("@/layouts/main-layout/MainLayout.vue"),
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/AuthLayout.vue"),
    children: [
      {
        path: "/sign-in",
        name: "sign-in",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignIn.vue"),
        meta: {
          pageTitle: "Sign In",
        },
      },
      {
        path: "/sign-up",
        name: "sign-up",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/SignUp.vue"),
        meta: {
          pageTitle: "Sign Up",
        },
      },
      {
        path: "/password-reset",
        name: "password-reset",
        component: () =>
          import("@/views/crafted/authentication/basic-flow/PasswordReset.vue"),
        meta: {
          pageTitle: "Password reset",
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("@/layouts/SystemLayout.vue"),
    children: [
      {
        // the 404 route, when none of the above matches
        path: "/404",
        name: "404",
        component: () => import("@/views/crafted/authentication/Error404.vue"),
        meta: {
          pageTitle: "Error 404",
        },
      },
      {
        path: "/500",
        name: "500",
        component: () => import("@/views/crafted/authentication/Error500.vue"),
        meta: {
          pageTitle: "Error 500",
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;

  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  authStore.verifyAuth();

  // before page access check if page requires authentication
  if (to.meta.middleware == "auth") {
    if (authStore.isAuthenticated) {
      next();
    } else {
      next({ name: "sign-in" });
    }
  } else {
    next();
  }

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
