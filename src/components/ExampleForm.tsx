import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function ExampleForm() {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().min(6, "Min 6 characters").required("Required"),
      })}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form className="space-y-4 max-w-sm mx-auto">
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <Field
            name="email"
            type="email"
            className="w-full border px-3 py-2 rounded"
          />
          <ErrorMessage
            name="email"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-semibold mb-1">
            Password
          </label>
          <Field
            name="password"
            type="password"
            className="w-full border px-3 py-2 rounded"
          />
          <ErrorMessage
            name="password"
            component="div"
            className="text-red-500 text-sm"
          />
        </div>
        <button
          type="submit"
          className="bg-[#8B000F] text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </Form>
    </Formik>
  );
}
