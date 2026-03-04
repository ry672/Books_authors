import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputApp } from "./UX/InputApp";
import { ButtonApp } from "./UX/ButtonApp";
import {
  useGetCategoryByIdQuery,
  usePatchCategoryMutation,
} from "../store/Api/CategoryApi";

type FormValues = {
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

export const UpdateCategoryAside = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) => {
  const { data: category, isLoading, isError } = useGetCategoryByIdQuery(id);

  const [patchCategory, { isLoading: isSaving, error: saveError }] =
    usePatchCategoryMutation();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "" },
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!category) return;
    reset({ name: category.name ?? "" });
  }, [category, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await patchCategory({
        id,
        data: { name: values.name },
      }).unwrap();

      onSuccess?.();
    } catch (e) {
      console.log("Update category failed:", e);
    }
  };

  const backendMessage =
    saveError &&
    typeof saveError === "object" &&
    saveError !== null &&
    "data" in saveError
      ? (saveError as any).data?.message
      : null;

  if (isLoading) return <div>Loading...</div>;
  if (isError || !category) return <div>Category not found</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <>
            <InputApp
              {...field}
              className="name"
              classId="name"
              placeholder="Fantasy"
              textArea="Name"
            />

            {/* yup error */}
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
        buttonText={isSaving ? "Saving..." : "Update"}
        buttonType="submit"
      />
    </form>
  );
};