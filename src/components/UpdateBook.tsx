import { useEffect } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useGetBookByIdQuery, usePatchBookMutation } from "../store/Api/BookApi";
import { InputApp } from "./UX/InputApp";
import { ButtonApp } from "./UX/ButtonApp";
import { LabelCategories } from "./LabelCategories";

type FormValues = {
  name: string;
  link: string;
  price: number;
  description: string;
  categoryId: number | null;
};

export const UpdateBookAside = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) => {
  const { data: book, isLoading: isBookLoading, isError } = useGetBookByIdQuery(id);
  const [patchBook, { isLoading: isSaving, error: saveError }] = usePatchBookMutation();

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      link: "",
      price: 1,
      description: "",
      categoryId: null,
    },
  });

 
  useEffect(() => {
    if (!book) return;
    reset({
      name: book.name ?? "",
      link: book.link ?? "",
      price: book.price ?? 1,
      description: book.description ?? "",
      categoryId: book.categoryId ?? null,
    });
  }, [book, reset]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await patchBook({
        id,
        data: {
          name: values.name,
          link: values.link,
          price: Number(values.price),
          description: values.description,
          categoryId: values.categoryId ? Number(values.categoryId) : undefined,
          authorId: book?.authorId, // keep same author
        },
      }).unwrap();

      onSuccess?.();
    } catch (e) {
      console.log("Update book failed:", e);
    }
  };

  if (isBookLoading) return <div>Loading...</div>;
  if (isError || !book) return <div>Book not found</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <InputApp {...field} className="name" classId="name" placeholder="Clean Code" textArea="Name" />
        )}
      />

      <Controller
        name="link"
        control={control}
        render={({ field }) => (
          <InputApp {...field} className="link" classId="link" placeholder="https://example.com" textArea="Link" />
        )}
      />

      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <InputApp
            {...field}
            className="price"
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
          <InputApp {...field} className="description" classId="description" placeholder="About book..." textArea="Description" />
        )}
      />

      <LabelCategories control={control} name="categoryId" />

      <ButtonApp buttonText={isSaving ? "Saving..." : "Update"} buttonType="submit" />

      {saveError && <p>Failed to update book</p>}
    </form>
  );
};