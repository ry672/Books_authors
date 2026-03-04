import { useEffect, useState } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { usePostAuthorMutation } from "../store/Api/AuthorApi";
import { setAuthor } from "../store/Slice/authorSlice";
import { InputApp } from "../components/UX/InputApp";
import { ButtonApp } from "../components/UX/ButtonApp";
import { useNavigate } from "react-router-dom";
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

export const CreateAuthorAside = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [postAuthor, { data, isLoading, isSuccess, error }] = usePostAuthorMutation();
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SubmitForm>({
    defaultValues: { name: "", full_name: "", country: "", description: "" },
    resolver: yupResolver(schema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setAuthor(data));
      reset();
      setFile(null);
      onSuccess?.();
      navigate("/author-page");
    }
  }, [isSuccess, data, dispatch, reset, onSuccess, navigate]);

  const onSubmit: SubmitHandler<SubmitForm> = async (formData) => {
    try {
      await postAuthor({ ...formData, file }).unwrap();
    } catch (e) {
      console.log("Create author failed:", e);
    }
  };
  const backendMessage =
    error && typeof error === "object" && error !== null && "data" in error
      ? (error as any).data?.message
      : null;




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
              placeholder="Rufina"
              textArea="Name"
            />

            {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
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
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
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
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
              classId="country"
              placeholder="Tashkent"
              textArea="Country"
            />
            {errors.country && <p className="text-xs text-red-600">{errors.country.message}</p>}
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
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-transparent focus:ring-2 focus:ring-black focus:outline-none"
              classId="description"
              placeholder="About author..."
              textArea="Description"
            />
            {errors.description && (
              <p className="text-xs text-red-600">{errors.description.message}</p>
            )}
          </>
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

      <ButtonApp buttonText={isLoading ? "Creating..." : "Create"} buttonType="submit" />
      {backendMessage && (
        <p className="text-sm text-red-600">{String(backendMessage)}</p>
      )}

      {error && <p className="text-sm text-red-600">Failed to create author</p>}
    </form>
  );
};