interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

export const sendContactEmail = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    // Usar proxy de Vite en desarrollo, API directa en producción
    const apiUrl = import.meta.env.DEV 
      ? '/api/contact/send-email' 
      : `${import.meta.env.VITE_API_URL}/contact/send-email`;
      
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al enviar el mensaje');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};