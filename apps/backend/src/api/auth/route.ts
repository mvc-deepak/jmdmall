import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/types"

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const authService: IAuthModuleService = req.scope.resolve("auth")

  const body = req.body as Record<string, unknown>

  let email: string | undefined
  let password: string | undefined

  if (body.body && typeof body.body === "object") {
    const bodyObj = body.body as Record<string, unknown>
    email = bodyObj.email as string
    password = bodyObj.password as string
  } else {
    email = body.email as string
    password = body.password as string
  }

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" })
    return
  }

  try {
    const result = await authService.authenticate("emailpass", {
      url: req.url,
      headers: req.headers as Record<string, string>,
      body: {
        email,
        password,
      },
    })

    res.json(result)
  } catch (error) {
    console.error("Authentication error:", error)
    res.status(401).json({ message: "Invalid credentials" })
  }
}
