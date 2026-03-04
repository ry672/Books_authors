import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { InputApp } from "./UX/InputApp";
import { ButtonApp } from "./UX/ButtonApp";
import { usePostCategoryMutation } from "../store/Api/CategoryApi";
import { setCategory } from "../store/Slice/categorySlice";
import * as yup from "yup";
import { bookApi } from "../store/Api/BookApi";

type SubmitForm = {
  name: string;
};

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "minimum 2 string")
    .max(20, "maximum 20 characters")
    .required("Fill"),
});

export const CreateCategoryAside = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const [postCategory, { isLoading, error }] = usePostCategoryMutation();
  const dispatch = useDispatch();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SubmitForm>({
    defaultValues: { name: "" },
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  const backendMessage =
    error && typeof error === "object" && error !== null && "data" in error
      ? (error as any).data?.message
      : null;

  const onSubmit: SubmitHandler<SubmitForm> = async (formData) => {
    try {
      const created = await postCategory(formData).unwrap();

      dispatch(setCategory(created));

      dispatch(bookApi.util.invalidateTags([{ type: "Books", id: "LIST" }]));

      reset();
      onSuccess?.();
    } catch (e) {
      console.log("Create category failed:", e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <>
            <InputApp
              {...field}
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
              classId="name"
              placeholder="Fantasy"
              textArea="Category name"
            />

 
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}

            {backendMessage && (
              <p className="text-xs text-red-600">{String(backendMessage)}</p>
            )}
          </>
        )}
      />

      <ButtonApp
        buttonText={isLoading ? "Creating..." : "Create"}
        buttonType="submit"
      />
    </form>
  );
};