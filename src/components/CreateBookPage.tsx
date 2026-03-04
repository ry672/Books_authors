import { LabelCategories } from "./LabelCategories";
import { ButtonApp } from "./UX/ButtonApp";
import { InputApp } from "./UX/InputApp";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { usePostBookMutation } from "../store/Api/BookApi";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setBook } from "../store/Slice/bookSlice";
import type { RootState } from "../store/store";

interface SubmitForm {
  name: string;
  price: number;
  description: string;
  link: string;
  authorId: number;
  categoryId: number | null; 
}

export const CreateBookAside = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [postBook, { data, isLoading, isSuccess, error }] =
    usePostBookMutation();

  const dispatch = useDispatch();
  const authorIdFromStore = useSelector((s: RootState) => s.author.author?.id);

  const { handleSubmit, control, reset} = useForm<SubmitForm>({
    defaultValues: {
      name: "",
      price: 1,
      link: "",
      description: "",
      authorId: authorIdFromStore ?? 1,
      categoryId: null,
    },
  });

  useEffect(() => {
  if (isSuccess && data) {
    dispatch(setBook(data));
    reset();
    onSuccess?.(); 
  }
}, [isSuccess, data, dispatch, reset, onSuccess]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setBook(data));
      reset();
    }
  }, [isSuccess, data, dispatch, reset]);

  const onSubmit: SubmitHandler<SubmitForm> = async (formData) => {
    const categoryId = Number(formData.categoryId);
    if (!categoryId || Number.isNaN(categoryId)) return; 

    try {
      await postBook({
        ...formData,
        authorId: authorIdFromStore ?? Number(formData.authorId),
        categoryId,
        price: Number(formData.price),
      } as any).unwrap();
    } catch (e) {
      console.log("Create book failed:", e);
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
              placeholder="Clean Code"
              textArea="Name"
            />
          )}
        />

        <Controller
          name="link"
          control={control}
          render={({ field }) => (
            <InputApp
              {...field}
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
              classId="link"
              placeholder="https://example.com"
              textArea="Link"
            />
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <InputApp
              {...field}
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
              classId="price"
              placeholder="100"
              textArea="Price"
              onChange={(e: any) => field.onChange(Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <InputApp
              {...field}
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
              classId="description"
              placeholder="Good book about code..."
              textArea="Description"
            />
          )}
        />

        <LabelCategories control={control} name="categoryId" />

        <ButtonApp
          buttonText={isLoading ? "Creating..." : "Create"}
          buttonType="submit"
        />

        {error && <p>Failed to create book</p>}
      </form>

  );
};