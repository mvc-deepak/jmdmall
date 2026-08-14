import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { AuthService } from "@medusajs/medusa/auth"

export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const authService = req.scope.resolve("auth")

  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" })
    return
  }

  try {
    const result = await authService.authenticate("customer", "emailpass", {
      email,
      password,
    })

    res.json(result)
  } catch (error) {
    res.status(401).json({ message: "Invalid credentials" })
  }
}
