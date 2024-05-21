import { useFieldArray, useForm } from "react-hook-form";
import "./styles/global.css";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, XCircle } from "lucide-react";
import { supabase, SUPABASE_BUCKET } from "./lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5mb
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const createUserFormSchema = z
  .object({
    avatar: z
      .instanceof(FileList)
      .refine(
        (files) => files.item(0)?.name,
        "A imagem de perfil é obrigatória"
      )
      .transform((fileList) => {
        return fileList.item(0)!;
      })
      .refine((file) => file.size <= MAX_FILE_SIZE, `Tamanho máximo de 5MB`)
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Formato de imagem inválido"
      ),
    name: z
      .string()
      .min(1, "O nome é obrigatório")
      .transform((name) => {
        return name
          .trim()
          .split(" ")
          .map((word) => {
            return word[0].toLocaleUpperCase().concat(word.substring(1));
          })
          .join(" ");
      }),
    email: z
      .string()
      .min(1, "O email é obrigatório")
      .email("Formato de email inválido")
      .toLowerCase()
      .refine((email) => {
        return email.endsWith("@gmail.com");
      }, "O email precisa ser do Gmail"),
    password: z
      .string()
      .min(6, "A senha precisa de no mínimo 6 caracteres")
      .max(12, "A senha precisa ter no máximo 12 caracteres"),
    confirmPassword: z.string().min(1, "As senhas não batem"),
    techs: z
      .array(
        z.object({
          title: z.string().min(1, "O título é obrigatório"),
          knowledge: z.coerce
            .number()
            .min(1, "Informe um nível de conhecimento")
            .max(100, "O máximo do nível de conhecimento é 100"),
        })
      )
      .min(2, "Insira pelo menos 2 tecnoligias")
      .refine((techs) => {
        return techs.some((tech) => tech.knowledge > 2);
      }, "Pelo menos uma tecnologia deve ser maior que 2")
      .refine((techs) => {
        const titles = techs.map((item) => item.title);
        const uniqueTitle = new Set(titles);
        return uniqueTitle.size === techs.length;
      }, "Não insira tecnologoias repetidas"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não batem",
        path: ["confirmPassword"],
      });
    }
  });

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState("");
  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      techs: [
        {
          title: "",
          knowledge: 1,
        },
      ],
    },
  });

  const userPassword = watch("password");
  const isPasswordStrong = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  ).test(userPassword);

  const { fields, append, remove } = useFieldArray({
    name: "techs",
    control,
  });

  const addNewTech = () => {
    append({
      title: "",
      knowledge: 1,
    });
  };

  const createUser = async (data: CreateUserFormData) => {
    const { data: uploadData, error } = await supabase.storage
    .from(SUPABASE_BUCKET)
    .upload(`avatars/${data.avatar?.name}`, data.avatar, {
      cacheControl: "3600",
      upsert: false,
    });
    
    console.log({avatarFile: data.avatar});
    console.log({ uploadData, error });

    setOutput(
      JSON.stringify(
        {
          ...data,
          avatar: data.avatar.size,
        },
        null,
        2
      )
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="avatar">Avatar</label>
          <input type="file" accept="image/*" {...register("avatar")} />
          {errors.avatar && (
            <span className="text-red-600 text-sm">
              {errors.avatar.message}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
            {...register("name")}
          />
          {errors.name && (
            <span className="text-red-600 text-sm">{errors.name.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
            {...register("email")}
          />
          {errors.email && (
            <span className="text-red-600 text-sm">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex w-full justify-between">
            <label htmlFor="password">Senha</label>{" "}
            {isPasswordStrong ? (
              <span className="text-xs text-emerald-600">Senha forte</span>
            ) : (
              <span className="text-xs text-amber-500">Senha fraca</span>
            )}
          </div>
          <input
            type="password"
            className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
            {...register("password")}
          />
          {errors.password && (
            <span className="text-red-600 text-sm">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="confirmPassword">Confirmar Senha</label>
          <input
            type="password"
            className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="text-red-600 text-sm">
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-emerald-500 text-sm hover:underline"
            >
              Adicionar
            </button>
          </label>
          {fields.map((field, index) => {
            const techError =
              errors.techs?.[index]?.title || errors.techs?.[index]?.knowledge;

            return (
              <div key={field.id}>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
                      {...register(`techs.${index}.title`)}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <input
                      type="number"
                      className="w-16 border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
                      {...register(`techs.${index}.knowledge`)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
                {techError && (
                  <span className="text-red-600 text-sm">
                    {techError.message}
                  </span>
                )}
              </div>
            );
          })}

          {errors.techs?.root && (
            <span className="text-red-600 text-sm">
              {errors.techs?.root.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`${!isSubmitting ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-zinc-600'} mt-4 rounded font-semibold flex justify-center items-center gap-4 text-white h-10`}
        >
          {!isSubmitting ? 'Salvar' : 'Enviando...'}
          {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin"  />}
        </button>
      </form>
      <pre className="text-sm max-w-sm w-full bg-zinc-800 text-zinc-100 p-6 rounded-lg">
        {output}
      </pre>
    </main>
  );
}

export default App;
