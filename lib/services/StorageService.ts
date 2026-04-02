import { createClient } from '@/lib/supabase/client'

export class StorageService {
  private static supabase = createClient()

  static async uploadProductImage(file: File, productId: string) {
    const timestamp = Date.now()
    const ext = file.name.split('.').pop()
    const path = `product-images/${productId}/${timestamp}.${ext}`

    const { data, error } = await this.supabase.storage
      .from('product-images')
      .upload(path, file)

    if (error) throw error

    const { data: { publicUrl } } = this.supabase.storage
      .from('product-images')
      .getPublicUrl(path)

    return publicUrl
  }

  static async uploadBusinessLogo(file: File, businessId: string) {
    const path = `business-logos/${businessId}/${Date.now()}.${file.name.split('.').pop()}`

    const { data, error } = await this.supabase.storage
      .from('business-logos')
      .upload(path, file)

    if (error) throw error

    const { data: { publicUrl } } = this.supabase.storage
      .from('business-logos')
      .getPublicUrl(path)

    return publicUrl
  }

  static async deleteFile(path: string, bucket: string = 'product-images') {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }
}
