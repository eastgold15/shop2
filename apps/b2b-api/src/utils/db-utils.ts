export const dataScopeFilters = {
  factory_sales: (ctx) => ({
    // 工厂业务员：只能看类型为“工厂”的部门，且排除自己
    type: { eq: "factory" },
    id: { ne: ctx.user.context.deptId },
  }),
  general_sales: (ctx) => ({
    // 通用业务员：看自己部门
    id: { eq: ctx.user.context.deptId },
  }),
  admin: () => ({}), // 管理员不加过滤
};
