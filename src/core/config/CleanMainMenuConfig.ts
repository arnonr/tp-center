export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
    //   {
    //     heading: "Dashboard",
    //     route: "/dashboard",
    //     keenthemesIcon: "element-11",
    //     bootstrapIcon: "bi-app-indicator",
    //   },
      {
        heading: "ศูนย์ปฏิบัติการ",
        route: "/center",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "โครงการ",
        route: "/project",
        keenthemesIcon: "book",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "ออกเลขงานทดสอบ/ตรวจสอบ",
        route: "/inspection",
        keenthemesIcon: "file",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "จัดการผู้ใช้งาน",
        route: "/user",
        keenthemesIcon: "user",
        bootstrapIcon: "bi-app-indicator",
      },
    //   {
    //     heading: "ศูนย์ปฏิบัติการใหม่",
    //     route: "/center-new",
    //     keenthemesIcon: "eye    ",
    //     bootstrapIcon: "bi-app-indicator",
    //   },
    ],
  },
];

export default MainMenuConfig;
