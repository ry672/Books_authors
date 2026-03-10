import { useEffect, useRef, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { usePostAuthorMutation } from "../store/Api/AuthorApi";
import { setAuthor } from "../store/Slice/authorSlice";
import { InputApp } from "../components/UX/InputApp";
import { ButtonApp } from "../components/UX/ButtonApp";
import { useNavigate } from "react-router-dom";
import { uploadToImageKit } from "../imageKit/imageKit";
import * as yup from "yup";

interface SubmitForm {
  name: string;
  full_name: string;
  description: string;
  country: string;
}

const schema = yup.object({
  name: yup.string().trim().min(2, "minimum 2 string").required("Fill"),
  full_name: yup.string().trim().min(3, "minimum 3 string").required("Fill"),
  description: yup.string().trim().min(5, "minimum 5 string").required("Fill"),
  country: yup.string().trim().min(2, "minimum 2 string").required("Fill"),
});

export const CreateAuthorAside = ({
  onSuccess,
}: {
  onSuccess?: () => void;
}) => {
  const [postAuthor, { data, isLoading, isSuccess, error }] =
    usePostAuthorMutation();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SubmitForm>({
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
    if (!isSuccess || !data) return;

    dispatch(setAuthor(data));
    reset();
    setFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onSuccess?.();
    navigate("/author-page");
  }, [isSuccess, data, dispatch, reset, onSuccess, navigate]);

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

  const onSubmit: SubmitHandler<SubmitForm> = async (formData) => {
    try {
      let author_photo: string | undefined;

      if (file) {
        const uploaded = await uploadToImageKit(file);

        author_photo =
          typeof uploaded?.url === "string"
            ? uploaded.url.replace(/^https(?=\/\/ik\.imagekit\.io)/, "https:")
            : undefined;
      }

      await postAuthor({
        ...formData,
        author_photo,
      }).unwrap();
    } catch (e) {
      console.log("Create author failed:", e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);
  };

  const handleCancelFile = () => {
    setFile(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const backendMessage =
    error && typeof error === "object" && error !== null && "data" in error
      ? String((error as { data?: { message?: string } }).data?.message ?? "")
      : null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-3 bg-[#10141C]"
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <>
            <InputApp
              {...field}
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px] px-2 py-1"
              classId="name"
              placeholder="Rufina"
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
              placeholder="Garaeva"
              textArea="Full_Name"
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
              placeholder="Tashkent"
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

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-2 h-24 w-24 rounded-md border border-[#2D3748] object-cover"
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
        buttonText={isLoading ? "Creating..." : "Create"}
        buttonType="submit"
        className="mx-2 mt-5 w-full rounded-md border bg-white px-2 py-2 text-[14px] font-semibold text-black"
      />

      {backendMessage && (
        <p className="text-sm text-red-600">{backendMessage}</p>
      )}

      {error && !backendMessage && (
        <p className="text-sm text-red-600">Failed to create author</p>
      )}
    </form>
  );
};