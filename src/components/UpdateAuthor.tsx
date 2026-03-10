import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useGetAuthorByIdQuery,
  usePatchAuthorMutation,
} from "../store/Api/AuthorApi";
import { InputApp } from "./UX/InputApp";
import { ButtonApp } from "./UX/ButtonApp";
import * as yup from "yup";
import { uploadToImageKit } from "../imageKit/imageKit";
import defaultAvatar from "../images/icons8-user-default-64.png";

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
    if (!author) return;

    try {
      let author_photo: string | undefined = author.author_photo;

      if (file) {
        const uploaded = await uploadToImageKit(file);
        author_photo =
          typeof uploaded?.url === "string"
            ? uploaded.url.replace(/^https(?=\/\/ik\.imagekit\.io)/, "https:")
            : author.author_photo;
      }

      await patchAuthor({
        id,
        data: {
          ...values,
          author_photo,
        },
      }).unwrap();

      onSuccess?.();
    } catch (e) {
      console.log("Update author failed:", e);
    }
  };

  const currentImage = useMemo(() => {
    if (!author?.author_photo) return defaultAvatar;

    const normalizedPhoto = author.author_photo.replace(
      /^https(?=\/\/)/,
      "https:"
    );

    if (
      normalizedPhoto.startsWith("http://") ||
      normalizedPhoto.startsWith("https://")
    ) {
      return normalizedPhoto;
    }

    const baseUrl =
      import.meta.env.VITE_SERVER_URL ||
      "https://bookaythorsback-production.up.railway.app";

    return `${baseUrl}${normalizedPhoto.startsWith("/") ? "" : "/"}${normalizedPhoto}`;
  }, [author]);

  const backendMessage =
    saveError &&
    typeof saveError === "object" &&
    saveError !== null &&
    "data" in saveError
      ? String((saveError as { data?: { message?: string } }).data?.message ?? "")
      : null;

  const handleCancelFile = () => {
    setFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
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
        <p className="text-xs text-red-600">{backendMessage}</p>
      )}

      <div className="pt-2">
        <label className="mb-2 block text-sm">Avatar</label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="rounded-md border bg-white px-3 py-2 text-[12px] font-medium text-black"
          >
            Choose file
          </button>

          <span className="text-xs text-white">
            {file ? `Selected: ${file.name}` : ""}
          </span>
        </div>

        {(preview || currentImage) && (
          <img
            src={preview || currentImage}
            alt="Preview"
            className="mt-2 h-24 w-24 rounded-md object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultAvatar;
            }}
          />
        )}

        {file && (
          <button
            type="button"
            onClick={handleCancelFile}
            className="mt-2 rounded-md border bg-white px-3 py-2 text-[12px] font-medium text-black"
          >
            Cancel
          </button>
        )}
      </div>

      <ButtonApp
        buttonText={isSaving ? "Saving..." : "Update"}
        buttonType="submit"
        className="mx-2 mt-5 w-full rounded-md border bg-white px-2 py-2 text-[14px] font-semibold text-black"
      />
    </form>
  );
};