export default async function handler(req, res) {
  try {
    return res.status(200).json({
      success: true,
      message: "Talking Head API Ready"
    });
  } catch (error) {
    console.error("get-talking-head error:", error);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
 
