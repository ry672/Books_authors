import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { useGetAuthorByIdQuery, usePatchAuthorMutation } from "../store/Api/AuthorApi";
import { InputApp } from "./UX/InputApp";
import { ButtonApp } from "./UX/ButtonApp";

type FormValues = {
  name: string;
  full_name: string;
  description: string;
  country?: string;
  file?: File | null;
};

export const UpdateAuthorAside = ({
  id,
  onSuccess,
}: {
  id: number;
  onSuccess?: () => void;
}) => {
  const { data: author, isLoading, isError } = useGetAuthorByIdQuery(id);
  const [patchAuthor, { isLoading: isSaving, error: saveError }] =
    usePatchAuthorMutation();

  const [file, setFile] = useState<File | null>(null);

  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      full_name: "",
      description: "",
      country: "",
      file: null,
    },
  });

  useEffect(() => {
    if (!author) return;
    reset({
      name: author.name ?? "",
      full_name: author.full_name ?? "",
      description: author.description ?? "",
      country: author.country ?? "",
      file: null,
    });
  }, [author, reset]);
  

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await patchAuthor({
        id,
        data: {
          name: values.name,
          full_name: values.full_name,
          description: values.description,
          country: values.country,
          file: file ?? undefined,
        },
      }).unwrap();

      onSuccess?.();
    } catch (e) {
      console.log("Update author failed:", e);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError || !author) return <div>Author not found</div>;

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
            placeholder="Author name"
            textArea="Name"
          />
        )}
      />

      <Controller
        name="full_name"
        control={control}
        render={({ field }) => (
          <InputApp
            {...field}
            className="full_name"
            classId="full_name"
            placeholder="Full name"
            textArea="Full name"
          />
        )}
      />

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <InputApp
            {...field}
            className="country"
            classId="country"
            placeholder="Country"
            textArea="Country"
          />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <InputApp
            {...field}
            className="description"
            classId="description"
            placeholder="About author..."
            textArea="Description"
          />
        )}
      />

      <div className="pt-2">
        <label className="text-sm">Avatar</label>
        <input
          className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-teal-500 file:py-2 file:px-4 file:text-sm file:font-semibold file:text-white hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file && <div className="text-xs mt-1">Selected: {file.name}</div>}
      </div>

      <ButtonApp buttonText={isSaving ? "Saving..." : "Update"} buttonType="submit" />

      {saveError && <p>Failed to update author</p>}
    </form>
  );
};