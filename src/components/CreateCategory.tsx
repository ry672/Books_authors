import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { InputApp } from "./UX/InputApp";
import { ButtonApp } from "./UX/ButtonApp";
import { usePostCategoryMutation } from "../store/Api/CategoryApi";
import { setCategory } from "../store/Slice/categorySlice";

type SubmitForm = {
  name: string;
};

export const CreateCategoryAside = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [postCategory, { data, isLoading, isSuccess, error }] =
    usePostCategoryMutation();

  const dispatch = useDispatch();

  const { handleSubmit, control, reset } = useForm<SubmitForm>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCategory(data));
      reset();
      onSuccess?.();
    }
  }, [isSuccess, data, dispatch, reset, onSuccess]);

  const onSubmit: SubmitHandler<SubmitForm> = async (formData) => {
    try {
      await postCategory(formData).unwrap();
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
          <InputApp
            {...field}
            className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
            classId="name"
            placeholder="Fantasy"
            textArea="Category name"
          />
        )}
      />

      <ButtonApp
        buttonText={isLoading ? "Creating..." : "Create"}
        buttonType="submit"
      />

      {error && <p>Failed to create category</p>}
    </form>
  );
};