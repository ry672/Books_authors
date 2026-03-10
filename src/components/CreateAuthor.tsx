import { useEffect, useRef, useState } from "react";
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
  const [preview, setPreview] = useState<string>("")
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const urlRef = useRef<HTMLInputElement|null>(null)
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

  useEffect(()=>{
    if(!file){
      setPreview("")
      return
    } else {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl)

      return (()=>{
        URL.revokeObjectURL(objectUrl)
      })
    }
  }, [file])

  

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 bg-[#10141C]">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <>
            <InputApp
              {...field}
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px]  px-2 py-1"
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
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px]  px-2 py-1"
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
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px]  px-2 py-1"
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
              className="bg-gray-900 rounded-md border border-[#2D3748] placeholder:text-[14px]  px-2 py-1"
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
          ref={urlRef}
          className="mt-2 block w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-white file:py-2 file:px-4 file:text-sm file:font-semibold file:text-black hover:file:bg-teal-700 focus:outline-none disabled:pointer-events-none disabled:opacity-60"
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file && <div className="text-xs mt-1">Selected: {file.name}</div>}
        {preview && <img src={preview}/>}

        
        
      </div>
      <button 
      type="button"
      onChange={() => setFile(null)}
      onClick={()=>{
        
        setFile(null)
        setPreview("")
        if (urlRef.current) {
          urlRef.current.value=""
          
        }
        
      }}>Cancel</button>
      
      

      <ButtonApp buttonText={isLoading ? "Creating..." : "Create"} buttonType="submit" className="brounded-md border bg-white px-2 py-2 text-[14px] text-black font-semibold w-full rounded-md mx-2 mt-55"/>
      {backendMessage && (
        <p className="text-sm text-red-600">{String(backendMessage)}</p>
      )}

      {error && <p className="text-sm text-red-600">Failed to create author</p>}
    </form>
  );
};