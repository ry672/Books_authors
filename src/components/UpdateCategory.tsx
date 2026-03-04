import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { InputApp } from "./UX/InputApp";
import { ButtonApp } from "./UX/ButtonApp";
import { useGetCategoryByIdQuery, usePatchCategoryMutation } from "../store/Api/CategoryApi";

type FormValues = {
  name: string;
};

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

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: { name: "" },
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

  if (isLoading) return <div>Loading...</div>;
  if (isError || !category) return <div>Category not found</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <InputApp
            {...field}
            className="name"
            classId="name"
            placeholder="Fantasy"
            textArea="Name"
          />
        )}
      />

      <ButtonApp
        buttonText={isSaving ? "Saving..." : "Update"}
        buttonType="submit"
      />

      {saveError && <p>Failed to update category</p>}
    </form>
  );
};