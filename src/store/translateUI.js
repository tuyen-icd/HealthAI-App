export const translations = {
  vi: {
    title: "🥗 HealthAI",
    subtitle: "Chụp ảnh món ăn → AI phân tích dinh dưỡng",
    pickImage: "📷 Chọn ảnh món ăn",
    analyzing: "Đang phân tích...",
    calories: "🔥 Calories",
    protein: "💪 Protein",
    carbs: "🍚 Carbs",
    fat: "🥑 Fat",
    benefits: "🌱 Lợi ích",
    ingredients: "🥦 Nguyên liệu",
    weight: "⚖️ Cân nặng (kg)",
    height: "📏 Chiều cao (cm)",
    age: "🎂 Tuổi",
    burnCalories: "🏃 Vận động cần thiết",
    walk: "🚶 Đi bộ",
    run: "🏃 Chạy bộ",
    minutes: "phút",
    // thêm cho burnInfo
    energyFromFood: "⚡ Năng lượng từ món ăn",
    bmrMale: "👨 Nam cần BMR ~",
    bmrFemale: "👩 Nữ cần BMR ~",
    exerciseSuggest: "🏋️ Gợi ý vận động để đốt",

    bmrTooltipTitle: "BMR là gì?",
    bmrTooltipContent:
      "BMR (Basal Metabolic Rate) là lượng năng lượng tối thiểu cơ thể cần để duy trì sự sống (thở, tim đập, tuần hoàn...). Biết BMR giúp bạn ước tính số calo nên ăn và mức vận động cần thiết.",
    guide: `
    👋 Chào mừng bạn đến với HealthAI!
    👉 Hãy nhập tuổi, cân nặng, chiều cao và chọn ảnh món ăn mà bạn muốn phân tích.
    🧠 Ứng dụng sẽ sử dụng AI để:
     • Tính toán lượng calo trung bình phù hợp với cơ thể bạn.
     • Phân tích dinh dưỡng trong món ăn bạn chọn.
     • Gợi ý mức vận động cần thiết để cân bằng năng lượng.
    ✅Mục tiêu: Giúp bạn hiểu rõ hơn về chế độ ăn uống và sức khoẻ hằng ngày.`,
    analysis: "🔄 Phân tích lại",
  },
  en: {
    title: "🥗 HealthAI",
    subtitle: "Take a food photo → AI analyzes nutrition",
    pickImage: "📷 Pick a food image",
    analyzing: "Analyzing...",
    calories: "🔥 Calories",
    protein: "💪 Protein",
    carbs: "🍚 Carbs",
    fat: "🥑 Fat",
    benefits: "🌱 Benefits",
    ingredients: "🥦 Ingredients",
    weight: "⚖️ Weight (kg)",
    height: "📏 Height (cm)",
    age: "🎂 Age",
    burnCalories: "🏃 Exercise required",
    walk: "🚶 Walking",
    run: "🏃 Running",
    minutes: "min",
    // burnInfo
    energyFromFood: "⚡ Energy from food",
    bmrMale: "👨 Male BMR ~",
    bmrFemale: "👩 Female BMR ~",
    exerciseSuggest: "🏋️ Suggested exercise to burn",

    bmrTooltipTitle: "What is BMR?",
    bmrTooltipContent:
      "BMR (Basal Metabolic Rate) is the minimum energy your body needs to maintain vital functions (breathing, heartbeat, circulation...). Knowing your BMR helps estimate calorie intake and exercise needs.",
    guide: `
    👋 Welcome to HealthAI!
    👉 Enter your age, weight, height and select the food image you want to analyze.
    🧠 The app will use AI to:
     • Calculate the average calorie intake suitable for your body.
     • Analyze the nutrition in the food you choose.
     • Suggest the necessary level of activity to balance energy.
    ✅Objective: Help you better understand your daily diet and health.`,
    analysis: "🔄 Re-analyze",
  },
  ja: {
    title: "🥗 ヘルスAI",
    subtitle: "料理の写真を撮る → AIが栄養を分析",
    pickImage: "📷 食べ物の写真を選択",
    analyzing: "分析中...",
    calories: "🔥 カロリー",
    protein: "💪 たんぱく質",
    carbs: "🍚 炭水化物",
    fat: "🥑 脂質",
    benefits: "🌱 効能",
    ingredients: "🥦 材料",
    weight: "⚖️ 体重 (kg)",
    height: "📏 身長 (cm)",
    age: "🎂 年齢",
    burnCalories: "🏃 必要な運動量",
    walk: "🚶 ウォーキング",
    run: "🏃 ランニング",
    minutes: "分",
    // burnInfo
    energyFromFood: "⚡ 食事からのエネルギー",
    bmrMale: "👨 男性のBMR ~",
    bmrFemale: "👩 女性のBMR ~",
    exerciseSuggest: "🏋️ 消費するための運動",

    bmrTooltipTitle: "BMRとは？",
    bmrTooltipContent:
      "BMR（基礎代謝量）は、呼吸や心拍など生命維持に必要な最小限のエネルギーです。BMRを知ることで、食事や運動の目安が分かります。",
    guide: `
    👋 HealthAI へようこそ！
    👉 年齢、体重、身長を入力し、分析したい食べ物の画像を選択してください。
    🧠 アプリはAIを使用して以下のことを行います。
     • あなたの体に適した平均カロリー摂取量を計算します。
     • 選択した食品の栄養を分析します。
     • エネルギーバランスを整えるために必要な活動レベルを提案します。
    ✅目的: 毎日の食事と健康状態をより深く理解できるようにします。
    `,
    analysis: "🔄 再分析",
  },
};

export const stepsOnboarding = [
  {
    title: "👋 Chào mừng bạn đến với HealthAI!",
    text:
      "Ứng dụng giúp bạn phân tích dinh dưỡng từ món ăn 🍜\n\n" +
      "👉 Nhập tuổi, cân nặng, chiều cao và chọn ảnh món ăn.\n\n" +
      "🧠 AI sẽ phân tích và gợi ý chế độ ăn phù hợp.",
    nextBtnText: "Tiếp theo ➡️",
  },
  {
    title: "👋 Welcome to HealthAI!",
    text:
      "This app helps you analyze nutrition from your food 🍔\n\n" +
      "👉 Enter your age, weight, height, and choose a food photo.\n\n" +
      "🧠 AI will analyze and suggest a suitable diet.",
    nextBtnText: "Next ➡️",
  },
  {
    title: "👋 ヘルスAIへようこそ!",
    text:
      "このアプリは料理の栄養を分析します 🍣\n\n" +
      "👉 年齢、体重、身長を入力し、食べ物の写真を選んでください。\n\n" +
      "🧠 AIが分析して適切な食事を提案します。",
    nextBtnText: "始めましょう 🎉",
  },
];
