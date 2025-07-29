import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
const API_BASE_URL = "https://localhost:3001/api/v1";

// ✅ Register (multipart/form-data for image upload)
export const useRegister = () => {
  return useMutation({
    mutationKey: ["REGISTER_USER"],
    mutationFn: (formData: FormData) =>
      axios.post(`${API_BASE_URL}/auth/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
  });
};

// ✅ Login
export const useLogin = () => {
  return useMutation({
    mutationKey: ["LOGIN_USER"],
    mutationFn: (data: { email: string; password: string }) =>
      axios.post(`${API_BASE_URL}/auth/login`, data),
  });
};

// ✅ OTP Verification
export const useVerifyOTP = () => {
  return useMutation({
    mutationKey: ["VERIFY_OTP"],
    mutationFn: (data: { email: string; otp: string }) =>
      axios.post(`${API_BASE_URL}/auth/verify-otp`, data),
  });
};

// ✅ Resend OTP
export const useResendOTP = () => {
  return useMutation({
    mutationKey: ["RESEND_OTP"],
    mutationFn: (data: { email: string }) =>
      axios.post(`${API_BASE_URL}/auth/resend-otp`, data),
  });
};

export const useUpdateUser = () => {
  return useMutation({
    mutationKey: ["UPDATE_USER"],
    mutationFn: (data: {
      userId: string;
      name: string;
      email: string;
      phone: string;
      image?: File;
    }) => {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      if (data.image) {
        formData.append("image", data.image);
      }

      return axios.put(
        `${API_BASE_URL}/auth/updateUser/${data.userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    },
  });
};


// ✅ Get All Foods
export const useGetFoods = () => {
  return useQuery({
    queryKey: ["GET_FOODS"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/foods`);
      return res.data.data;
    },
  });
};

// ✅ Add Food
export const useAddFood = () => {
  return useMutation({
    mutationKey: ["ADD_FOOD"],
    mutationFn: (data: { name: string; calorie: number }) =>
      axios.post(`${API_BASE_URL}/foods`, data),
  });
};

// ✅ Update Food
export const useUpdateFood = () => {
  return useMutation({
    mutationKey: ["UPDATE_FOOD"],
    mutationFn: (data: { id: string; name: string; calorie: number }) =>
      axios.put(`${API_BASE_URL}/foods/${data.id}`, {
        name: data.name,
        calorie: data.calorie,
      }),
  });
};

// ✅ Delete Food
export const useDeleteFood = () => {
  return useMutation({
    mutationKey: ["DELETE_FOOD"],
    mutationFn: (id: string) => axios.delete(`${API_BASE_URL}/foods/${id}`),
  });
};

// ✅ Update General Progress
export const useUpdateProgress = () => {
  return useMutation({
    mutationKey: ["UPDATE_PROGRESS"],
    mutationFn: (data: {
      user_id: string;
      progress_data: {
        waterIntake?: number;
        exerciseMinutes?: number;
        exerciseName?: string;
        caloriesConsumed?: number;
        foodName?: string;
        caloriesBurned?: number;
        sleepHours?: number;
      };
    }) => axios.post(`${API_BASE_URL}/progress/update`, data),
  });
};

// ✅ Water Intake
export const useUpdateWaterIntake = () => {
  return useMutation({
    mutationKey: ["UPDATE_WATER_INTAKE"],
    mutationFn: (data: { userId: string; waterIntake: number }) =>
      axios.put(`${API_BASE_URL}/progress/${data.userId}/updateWaterIntake`, {
        waterIntake: data.waterIntake,
      }),
  });
};

// ✅ Exercise
export const useUpdateExercise = () => {
  return useMutation({
    mutationKey: ["LOG_OR_UPDATE_EXERCISE"],
    mutationFn: (data: {
      userId: string;
      exerciseMinutes: number;
      exerciseName: string;
      caloriesBurned: number;
    }) =>
      axios.post(`${API_BASE_URL}/progress/${data.userId}`, {
        exerciseMinutes: data.exerciseMinutes,
        exerciseName: data.exerciseName,
        caloriesBurned: data.caloriesBurned,
      }),
  });
};

// ✅ Calories Consumed
export const useUpdateCaloriesConsumed = () => {
  return useMutation({
    mutationKey: ["UPDATE_CALORIES_CONSUMED"],
    mutationFn: (data: {
      userId: string;
      caloriesConsumed: number;
      foodName: string;
    }) =>
      axios.put(`${API_BASE_URL}/progress/${data.userId}/updateCaloriesConsumed`, {
        caloriesConsumed: data.caloriesConsumed,
        foodName: data.foodName,
      }),
  });
};

// ✅ Calories Burned
export const useUpdateCaloriesBurned = () => {
  return useMutation({
    mutationKey: ["UPDATE_CALORIES_BURNED"],
    mutationFn: (data: { userId: string; caloriesBurned: number }) =>
      axios.put(`${API_BASE_URL}/progress/${data.userId}/updateCaloriesBurned`, {
        caloriesBurned: data.caloriesBurned,
      }),
  });
};

// ✅ Sleep
export const useUpdateSleep = () => {
  return useMutation({
    mutationKey: ["UPDATE_SLEEP"],
    mutationFn: (data: { userId: string; sleepHours: number }) =>
      axios.put(`${API_BASE_URL}/progress/${data.userId}/updateSleep`, {
        sleepHours: data.sleepHours,
      }),
  });
};

// ✅ Delete Progress Entry
export const useDeleteProgressEntry = () => {
  return useMutation({
    mutationKey: ["DELETE_PROGRESS_ENTRY"],
    mutationFn: (data: { userId: string; entryId: string }) =>
      axios.delete(`${API_BASE_URL}/progress/${data.userId}/${data.entryId}`),
  });
};

// ✅ Get User Progress
export const useGetUserProgress = (userId: string) => {
  return useQuery({
    queryKey: ["GET_USER_PROGRESS", userId],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/progress/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

// ✅ Exercises
export const useGetItemExercises = (userId: string) => {
  return useQuery({
    queryKey: ["GET_EXERCISES", userId],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/progress/${userId}/exercises`);
      return res.data.data;
    },
    enabled: !!userId,
  });
};


export const useAddExerciseItem = (userId: string) => {
  return useMutation({
    mutationKey: ["ADD_EXERCISE", userId],
    mutationFn: (data: { name: string; caloriesBurnedPerMinute: number }) =>
      axios.post(`${API_BASE_URL}/progress/${userId}/exercises`, data),
  });
};


export const useUpdateExerciseItem = (userId: string) => {
  return useMutation({
    mutationKey: ["UPDATE_EXERCISE", userId],
    mutationFn: (data: { id: string; name: string; caloriesBurnedPerMinute: number }) =>
      axios.put(`${API_BASE_URL}/progress/${userId}/exercises/${data.id}`, {
        name: data.name,
        caloriesBurnedPerMinute: data.caloriesBurnedPerMinute,
      }),
  });
};

export const useDeleteExerciseItem = (userId: string) => {
  return useMutation({
    mutationKey: ["DELETE_EXERCISE", userId],
    mutationFn: (id: string) =>
      axios.delete(`${API_BASE_URL}/progress/${userId}/exercises/${id}`),
  });
};