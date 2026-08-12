import { redirect } from 'next/navigation'
import { retrieveCustomer } from '@lib/data/customer'
import CheckoutPageClient from './checkout-page-client'

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const customer = await retrieveCustomer().catch(() => null)

  if (!customer) {
    redirect(`/${countryCode}/account/login?returnTo=/${countryCode}/checkout`)
  }

  return <CheckoutPageClient />
}
