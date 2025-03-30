import { getNiyatiBackendApiUrl, fetchWithAuth } from "@/utils/apiBE";
import { TInterviewFormValues } from "./types";
import { TInterviewRoomResponse } from "@/lib/api/types";
import { EBackendEndpoints } from "@/constants/endpoints";

export const initialzeInterviewForm = async (values: TInterviewFormValues): Promise<TInterviewRoomResponse> => {
  try {
    console.log("initialzeInterviewForm", JSON.stringify(values, null, 2))
    const response = await fetchWithAuth(getNiyatiBackendApiUrl(EBackendEndpoints.INITIALIZE_INTERVIEW), {
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      throw new Error('Failed to initialize interview');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}