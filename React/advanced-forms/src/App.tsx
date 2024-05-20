import { useFieldArray, useForm } from "react-hook-form";
import "./styles/global.css";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const createUserFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "O email é obrigatório")
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
    confirmPassword: z
      .string()
      .min(6, "A senha precisa de no mínimo 6 caracteres")
      .max(12, "A senha precisa ter no máximo 12 caracteres"),
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
      .min(3, "Insira pelo menos 2 tecnoligias")
      .refine((techs) => {
        return techs.some((tech) => tech.knowledge >= 20);
      }, "Você deve ter pelo menos uma tecnologia maior ou igual á 20"),
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
    control,
    register,
    handleSubmit,
    formState: { errors },
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

  const { fields, append } = useFieldArray({
    name: "techs",
    control,
  });

  const addNewTech = () => {
    append({
      title: "",
      knowledge: 1,
    });
  };

  const createUser = (data: CreateUserFormData) => {
    setOutput(JSON.stringify(data, null, 2));
  };

  return (
    <main className="h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center">
      <form
        onSubmit={handleSubmit(createUser)}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
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
          <label htmlFor="password">Senha</label>
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
            return (
              <div key={field.id} className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <input
                    type="text"
                    className="border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span className="text-red-600 text-sm">
                      {errors.techs?.[index]?.title.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    className="w-16 border border-zinc-800 bg-zinc-900 text-white shadow-sm rounded h-10 px-3"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-red-600 text-sm">
                      {errors.techs?.[index]?.knowledge.message}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {errors.techs && (
            <span className="text-red-600 text-sm">{errors.techs.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-emerald-500 mt-4 rounded font-semibold text-white h-10 hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>
      <pre>{output}</pre>
    </main>
  );
}

export default App;
