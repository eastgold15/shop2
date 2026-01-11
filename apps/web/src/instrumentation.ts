// instrumentation.ts
export function register() {
  console.log('--- NEXT.JS RUNTIME STARTING ---');
  console.log('PORT:', process.env.PORT);
  console.log('APP_HOST:', process.env.APP_HOST);
  console.log('APP_URL:', process.env.APP_URL);
  console.log('--------------------------------');
}

