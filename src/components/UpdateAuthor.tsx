import { useEffect, useRef, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetAuthorByIdQuery,
  usePatchAuthorMutation,
} from "../store/Api/AuthorApi";
import { InputApp } from "./UX/InputApp";
import { ButtonApp } from "./UX/ButtonApp";
import * as yup from "yup";

type FormValues = {
  name: string;
  full_name: string;
  description: string;
  country: string;
};

const schema = yup.object({
  name: yup.string().trim().min(2, "minimum 2 string").required("Fill"),
  full_name: yup.string().trim().min(3, "minimum 3 string").required("Fill"),
  description: yup.string().trim().min(5, "minimum 5 string").required("Fill"),
  country: yup.string().trim().min(2, "minimum 2 string").required("Fill"),
});

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
  const [preview, setPreview] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      full_name: "",
      description: "",
      country: "",
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (!author) return;

    reset({
      name: author.name ?? "",
      full_name: author.full_name ?? "",
      description: author.description ?? "",
      country: author.country ?? "",
    });

    setFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [author, reset]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      await patchAuthor({
        id,
        data: {
          ...values,
          file: file ?? undefined,
        },
      }).unwrap();

      onSuccess?.();
    } catch (e) {
      console.log("Update author failed:", e);
    }
  };

  const backendMessage =
    saveError &&
    typeof saveError === "object" &&
    saveError !== null &&
    "data" in saveError
      ? (saveError as any).data?.message
      : null;

  const handleCancelFile = () => {
    setFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <>
            <InputApp
              {...field}
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px] px-2 py-1"
              classId="name"
              placeholder="Author name"
              textArea="Name"
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </>
        )}
      />

      <Controller
        name="full_name"
        control={control}
        render={({ field }) => (
          <>
            <InputApp
              {...field}
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px] px-2 py-1"
              classId="full_name"
              placeholder="Full name"
              textArea="Full name"
            />
            {errors.full_name && (
              <p className="text-xs text-red-600">{errors.full_name.message}</p>
            )}
          </>
        )}
      />

      <Controller
        name="country"
        control={control}
        render={({ field }) => (
          <>
            <InputApp
              {...field}
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px] px-2 py-1"
              classId="country"
              placeholder="Country"
              textArea="Country"
            />
            {errors.country && (
              <p className="text-xs text-red-600">{errors.country.message}</p>
            )}
          </>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <>
            <InputApp
              {...field}
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px] px-2 py-1"
              classId="description"
              placeholder="About author..."
              textArea="Description"
            />
            {errors.description && (
              <p className="text-xs text-red-600">
                {errors.description.message}
              </p>
            )}
          </>
        )}
      />

      {backendMessage && (
        <p className="text-xs text-red-600">{String(backendMessage)}</p>
      )}

      <div className="pt-2">
        <label className="text-sm">Avatar</label>

        <input
          ref={fileInputRef}
          className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-white file:py-2 file:px-4 file:text-sm file:font-semibold file:text-black hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />

        {file && <div className="text-xs mt-1">Selected: {file.name}</div>}

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 h-24 w-24 rounded-md object-cover"
          />
        )}
      </div>

      <button type="button" onClick={handleCancelFile}>
        Cancel
      </button>

      <ButtonApp
        buttonText={isSaving ? "Saving..." : "Update"}
        buttonType="submit"
        className="rounded-md border bg-white px-2 py-2 text-[14px] text-black font-semibold w-full mx-2 mt-5"
      />
    </form>
  );
};