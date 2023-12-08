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
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "ออกเลขงานทดสอบ/ตรวจสอบ",
        route: "/inspection",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "จัดการผู้ใช้งาน",
        route: "/user",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
];

export default MainMenuConfig;
