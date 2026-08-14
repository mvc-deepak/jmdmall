import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { IAuthModuleService } from "@medusajs/types"

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const authService: IAuthModuleService = req.scope.resolve("auth")

  const { email, password } = req.body as { email: string; password: string }

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
