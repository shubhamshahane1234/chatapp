import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { ref, set, get } from "firebase/database";
import { database, auth } from "../firebase";
import { signinWithGoogle } from "../firebase"; // Make sure loginWithGoogle is properly defined

const Signup = () => {
  const [email, setemail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setpassword] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [error, setError] = useState("");
  let navigate = useNavigate();

  const handleGoogleSignup = async () => {
    // setLoading(true);
    try {
      // Log in with Google
      const result = await signinWithGoogle();
      const loggedInUser = result.user;
      console.log(result, "....check new user or not");
      // Check if the user exists in the database
      const userRef = ref(database, `users/${loggedInUser.uid}`); // Reference to the user in the 'users' node
      const userSnapshot = await get(userRef);
      console.log(userSnapshot.val(), "existance"); // Check if user exists in Firebase

      if (!userSnapshot.exists()) {
        // User does not exist, create their profile in the 'users' node
        const newUser = {
          uid: loggedInUser.uid,
          displayName: loggedInUser.displayName || loggedInUser.email, // Use displayName or email if displayName is not available
          email: loggedInUser.email,
          photoURL: loggedInUser.photoURL,
          online: true, // Track if the user is online
          lastOnline: Date.now(),
        };

        // Set new user data in Firebase
        await set(userRef, newUser);
      }

      // Pass the logged-in user data to the parent component (if needed)
      // checklogin(loggedInUser);
      // Assuming this function updates the parent component's state
    } catch (error) {
      console.error("Login Error:", error);
    }

    // setLoading(false);
    // window.location.href = "/";
    navigate("/");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      // Create the user
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const createdUser = result.user;

      // 🔧 Set display name after signup
      await updateProfile(createdUser, {
        displayName: username,
      });
      let picurl = await handleImageUpload(createdUser);

      // Save the user to Realtime Database
      const userRef = ref(database, `users/${createdUser.uid}`);
      // Construct user profile data
      const userSnapshot = await get(userRef);
      if (!userSnapshot.exists()) {
        const newUser = {
          uid: createdUser.uid,
          displayName: username, // Use part of email as displayName
          email: createdUser.email,
          photoURL: picurl || "", // No photo for email sign-up unless you allow upload
          online: true,
          lastOnline: Date.now(),
        };

        await set(userRef, newUser);
      }

      // Redirect to login or dashboard
      navigate("/login");
    } catch (error) {
      console.log(error.code);
      if (error.code === "auth/email-already-in-use") {
        // alert("This email is already in use. Please log in instead.");
        setError("This email is already in use.");
      } else if (error.code === "auth/invalid-email") {
        setError("Email format is invalid.");
      } else if (error.code === "auth/weak-password") {
        setError("weak password");
      } else {
        console.error("Signup error:", error.message);
        alert(error.message);
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file); // 👈 create local image URL
      setPreviewUrl(localUrl);
      setFile(file);
    }
  };

  const handleImageUpload = async (createuser) => {
    // const file = e.target.files[0];
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "user_profile_pics"); // your preset name

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dsaifekeo/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      setImageURL(data.secure_url); // get the uploaded image URL
      console.log("Image URL:", data.secure_url);
      await updateProfile(createuser, {
        photoURL: data.secure_url,
      });
      return data.secure_url;
      // Now save this URL to your database (e.g., Firebase Firestore)
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="  h-screen flex items-center justify-center   py-3 sm:max-w-xl sm:mx-auto">
      <div className="flex px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
        <div className="mx-auto ">
          {/* <div className="flex items-center space-x-5 justify-center">
            <svg
              fill="none"
              viewBox="0 0 397 94"
              height="auto"
              width={85}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill="black"
                d="M128.72 39.9429L138.387 5.10122C139.027 2.79347 141.139 1.19507 143.547 1.19507H150.18C153.843 1.19507 156.423 4.76704 155.253 8.21447L136.91 62.2543C136.175 64.417 134.134 65.8735 131.837 65.8735H122.921C120.624 65.8735 118.583 64.417 117.848 62.2543L99.5067 8.21605C98.3361 4.76861 100.917 1.19664 104.579 1.19664H111.213C113.621 1.19664 115.734 2.79504 116.373 5.10279L126.039 39.9444C126.415 41.2969 128.344 41.2969 128.72 39.9444V39.9429Z"
              />
              <path
                fill="black"
                d="M195.231 67.0714C185.686 67.0714 177.916 64.163 171.922 58.3432C165.926 52.525 162.93 44.7741 162.93 35.0891V33.4151C162.93 26.9206 164.194 21.1118 166.719 15.9903C169.246 10.8704 172.825 6.92483 177.456 4.15364C182.088 1.38402 187.372 0 193.307 0C202.209 0 209.217 2.79011 214.33 8.36875C219.442 13.949 221.999 21.859 221.999 32.1004V33.8344C221.999 36.7727 219.602 39.1545 216.645 39.1545H182.207C181.32 39.1545 180.659 39.9711 180.846 40.8317C181.596 44.2855 183.195 47.1134 185.636 49.3155C188.463 51.8661 192.042 53.1413 196.374 53.1413C201.178 53.1413 205.229 51.9007 208.527 49.418C210.773 47.7266 213.935 47.9788 215.813 50.0675L217.472 51.9133C219.399 54.0587 219.291 57.369 217.163 59.3174C215.131 61.1774 212.751 62.7349 210.029 63.9896C205.578 66.042 200.645 67.0682 195.231 67.0682V67.0714ZM193.245 13.9285C189.795 13.9285 186.999 15.0902 184.854 17.4122C182.708 19.7341 181.335 23.057 180.733 27.3793H204.915V25.9984C204.834 22.1553 203.792 19.184 201.787 17.0827C199.781 14.9815 196.933 13.93 193.245 13.93V13.9285Z"
              />
              <path
                fill="black"
                d="M270.517 11.6886C270.472 14.6553 267.858 17.004 264.712 16.9284C264.412 16.9205 264.119 16.9173 263.833 16.9173C261.298 16.9173 259.082 17.2137 257.185 17.8048C252.99 19.1132 250.197 22.8585 250.197 27.0232V60.5565C250.197 63.4948 247.67 65.8766 244.552 65.8766H237.509C234.391 65.8766 231.864 63.4948 231.864 60.5565V5.20833C231.864 2.99201 233.771 1.19657 236.121 1.19657H245.178C247.427 1.19657 249.287 2.84541 249.428 4.96085L249.531 6.54664C249.58 7.27648 250.573 7.55076 251.027 6.95806C254.568 2.32049 259.217 0.00170898 264.972 0.00170898C265.003 0.00170898 265.033 0.00170898 265.064 0.00170898C268.175 0.0143196 270.656 2.46552 270.611 5.39907L270.515 11.6902L270.517 11.6886Z"
              />
              <path
                fill="black"
                d="M312.047 48.0009C312.047 45.8886 310.994 44.2256 308.889 43.0102C306.784 41.7949 303.405 40.7088 298.753 39.7519C283.273 36.5236 275.534 29.9881 275.534 20.1455C275.534 14.4061 277.929 9.61563 282.723 5.76937C287.514 1.92312 293.78 0 301.521 0C309.782 0 316.388 1.93416 321.341 5.79775C324.15 7.99043 326.163 10.5567 327.379 13.4934C328.832 17.0039 326.256 20.8612 322.435 20.8612H315.617C313.449 20.8612 311.573 19.485 310.784 17.4768C310.383 16.4553 309.782 15.5411 308.981 14.734C307.377 13.1198 304.869 12.3127 301.462 12.3127C298.535 12.3127 296.269 12.9701 294.665 14.2847C293.061 15.601 292.259 17.2734 292.259 19.3069C292.259 21.219 293.171 22.7638 294.997 23.9398C296.821 25.1157 299.898 26.1324 304.23 26.9884C308.56 27.8459 312.209 28.8106 315.178 29.8873C324.359 33.2354 328.953 39.0331 328.953 47.2821C328.953 53.1807 326.405 57.9523 321.314 61.5983C316.22 65.2444 309.644 67.0682 301.583 67.0682C296.129 67.0682 291.286 66.1019 287.056 64.1693C282.824 62.2367 279.507 59.5869 277.101 56.2183C276.29 55.0849 275.618 53.92 275.08 52.7252C273.513 49.2383 276.157 45.3085 280.001 45.3085H285.671C287.871 45.3085 289.867 46.6389 290.65 48.6803C291.22 50.162 292.137 51.3884 293.403 52.361C295.528 53.9957 298.375 54.8122 301.944 54.8122C305.272 54.8122 307.788 54.1848 309.493 52.9301C311.197 51.6753 312.05 50.0312 312.05 47.9977L312.047 48.0009Z"
              />
              <path
                fill="black"
                d="M370.097 67.0714C360.551 67.0714 352.782 64.163 346.787 58.3432C340.791 52.525 337.795 44.7741 337.795 35.0891V33.4151C337.795 26.9206 339.059 21.1118 341.584 15.9903C344.111 10.8704 347.69 6.92483 352.322 4.15364C356.953 1.38402 362.237 0 368.173 0C377.074 0 384.082 2.79011 389.195 8.36875C394.307 13.949 396.864 21.859 396.864 32.1004V33.8344C396.864 36.7727 394.467 39.1545 391.511 39.1545H357.072C356.186 39.1545 355.524 39.9711 355.711 40.8317C356.462 44.2855 358.06 47.1134 360.502 49.3155C363.328 51.8661 366.907 53.1413 371.239 53.1413C376.043 53.1413 380.095 51.9007 383.392 49.418C385.638 47.7266 388.8 47.9788 390.678 50.0675L392.337 51.9133C394.264 54.0587 394.156 57.369 392.028 59.3174C389.996 61.1774 387.616 62.7349 384.894 63.9896C380.444 66.042 375.51 67.0682 370.097 67.0682V67.0714ZM368.111 13.9285C364.661 13.9285 361.864 15.0902 359.72 17.4122C357.573 19.7341 356.2 23.057 355.599 27.3793H379.781V25.9984C379.7 22.1553 378.657 19.184 376.653 17.0827C374.646 14.9815 371.799 13.93 368.111 13.93V13.9285Z"
              />
              <path
                fill="url(#paint0_linear_501_142)"
                d="M38.0481 4.82927C38.0481 2.16214 40.018 0 42.4481 0H51.2391C53.6692 0 55.6391 2.16214 55.6391 4.82927V40.1401C55.6391 48.8912 53.2343 55.6657 48.4248 60.4636C43.6153 65.2277 36.7304 67.6098 27.7701 67.6098C18.8099 67.6098 11.925 65.2953 7.11548 60.6663C2.37183 56.0036 3.8147e-06 49.2967 3.8147e-06 40.5456V4.82927C3.8147e-06 2.16213 1.96995 0 4.4 0H13.2405C15.6705 0 17.6405 2.16214 17.6405 4.82927V39.1265C17.6405 43.7892 18.4805 47.2018 20.1605 49.3642C21.8735 51.5267 24.4759 52.6079 27.9678 52.6079C31.4596 52.6079 34.0127 51.5436 35.6268 49.4149C37.241 47.2863 38.0481 43.8399 38.0481 39.0758V4.82927Z"
              />
              <path
                fill="url(#paint1_linear_501_142)"
                d="M86.9 61.8682C86.9 64.5353 84.9301 66.6975 82.5 66.6975H73.6595C71.2295 66.6975 69.2595 64.5353 69.2595 61.8682V4.82927C69.2595 2.16214 71.2295 0 73.6595 0H82.5C84.9301 0 86.9 2.16214 86.9 4.82927V61.8682Z"
              />
              <path
                fill="url(#paint2_linear_501_142)"
                d="M2.86102e-06 83.2195C2.86102e-06 80.5524 1.96995 78.3902 4.4 78.3902H83.6C86.0301 78.3902 88 80.5524 88 83.2195V89.1707C88 91.8379 86.0301 94 83.6 94H4.4C1.96995 94 0 91.8379 0 89.1707L2.86102e-06 83.2195Z"
              />
              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  y2="87.6201"
                  x2="96.1684"
                  y1={0}
                  x1={0}
                  id="paint0_linear_501_142"
                >
                  <stop stopColor="#BF66FF" />
                  <stop stopColor="#6248FF" offset="0.510417" />
                  <stop stopColor="#00DDEB" offset={1} />
                </linearGradient>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  y2="87.6201"
                  x2="96.1684"
                  y1={0}
                  x1={0}
                  id="paint1_linear_501_142"
                >
                  <stop stopColor="#BF66FF" />
                  <stop stopColor="#6248FF" offset="0.510417" />
                  <stop stopColor="#00DDEB" offset={1} />
                </linearGradient>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  y2="87.6201"
                  x2="96.1684"
                  y1={0}
                  x1={0}
                  id="paint2_linear_501_142"
                >
                  <stop stopColor="#BF66FF" />
                  <stop stopColor="#6248FF" offset="0.510417" />
                  <stop stopColor="#00DDEB" offset={1} />
                </linearGradient>
              </defs>
            </svg>
          </div> */}
          <h1 className="text-center text-2xl font-bold text-gray-900">
            Sign In{" "}
          </h1>

          {/* upload image start  */}
          <form className="flex items-center space-x-6">
            <div className="shrink-0">
              <img
                className="h-16 w-16 object-cover rounded-full"
                src={
                  previewUrl ||
                  "https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg"
                }
                alt="Current profile pic"
              />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
              />
            </label>
          </form>
          {/* upload image end  */}
          <div className="mt-5">
            <label
              className="font-semibold text-sm text-gray-600 pb-1 block"
              htmlFor="login"
            >
              Username
            </label>
            <input
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              type="text"
              id="login"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />

            <label
              className="font-semibold text-sm text-gray-600 pb-1 block"
              htmlFor="login"
            >
              E-mail
            </label>
            <input
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              type="text"
              id="login"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <label
              className="font-semibold text-sm text-gray-600 pb-1 block"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
          </div>
          <span className="text-red-600">{error}</span>
          <div className="text-right mb-4">
            <a
              className="text-xs font-display font-semibold text-blue-500  hover:underline  cursor-pointer"
              href="/login"
            >
              Already Signup?
            </a>
          </div>
          <div className="flex justify-center w-full items-center">
            <div>
              <button className="flex items-center justify-center py-2 px-20 bg-white hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-blue-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg">
                <svg
                  viewBox="0 0 24 24"
                  height={25}
                  width={25}
                  y="0px"
                  x="0px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12,5c1.6167603,0,3.1012573,0.5535278,4.2863159,1.4740601l3.637146-3.4699707 C17.8087769,1.1399536,15.0406494,0,12,0C7.392395,0,3.3966675,2.5999146,1.3858032,6.4098511l4.0444336,3.1929321 C6.4099731,6.9193726,8.977478,5,12,5z"
                    fill="#F44336"
                  />
                  <path
                    d="M23.8960571,13.5018311C23.9585571,13.0101929,24,12.508667,24,12 c0-0.8578491-0.093689-1.6931763-0.2647705-2.5H12v5h6.4862061c-0.5247192,1.3637695-1.4589844,2.5177612-2.6481934,3.319458 l4.0594482,3.204834C22.0493774,19.135437,23.5219727,16.4903564,23.8960571,13.5018311z"
                    fill="#2196F3"
                  />
                  <path
                    d="M5,12c0-0.8434448,0.1568604-1.6483765,0.4302368-2.3972168L1.3858032,6.4098511 C0.5043335,8.0800171,0,9.9801636,0,12c0,1.9972534,0.4950562,3.8763428,1.3582153,5.532959l4.0495605-3.1970215 C5.1484375,13.6044312,5,12.8204346,5,12z"
                    fill="#FFC107"
                  />
                  <path
                    d="M12,19c-3.0455322,0-5.6295776-1.9484863-6.5922241-4.6640625L1.3582153,17.532959 C3.3592529,21.3734741,7.369812,24,12,24c3.027771,0,5.7887573-1.1248169,7.8974609-2.975708l-4.0594482-3.204834 C14.7412109,18.5588989,13.4284058,19,12,19z"
                    fill="#00B060"
                  />
                  <path
                    opacity=".1"
                    d="M12,23.75c-3.5316772,0-6.7072754-1.4571533-8.9524536-3.7786865C5.2453613,22.4378052,8.4364624,24,12,24 c3.5305786,0,6.6952515-1.5313721,8.8881226-3.9592285C18.6495972,22.324646,15.4981079,23.75,12,23.75z"
                  />
                  <polygon
                    opacity=".1"
                    points="12,14.25 12,14.5 18.4862061,14.5 18.587492,14.25"
                  />
                  <path
                    d="M23.9944458,12.1470337C23.9952393,12.0977783,24,12.0493774,24,12 c0-0.0139771-0.0021973-0.0274658-0.0022583-0.0414429C23.9970703,12.0215454,23.9938965,12.0838013,23.9944458,12.1470337z"
                    fill="#E6E6E6"
                  />
                  <path
                    opacity=".2"
                    d="M12,9.5v0.25h11.7855721c-0.0157471-0.0825195-0.0329475-0.1680908-0.0503426-0.25H12z"
                    fill="#FFF"
                  />
                  <linearGradient
                    gradientUnits="userSpaceOnUse"
                    y2={12}
                    y1={12}
                    x2={24}
                    x1={0}
                    id="LxT-gk5MfRc1Gl_4XsNKba_xoyhGXWmHnqX_gr1"
                  >
                    <stop stopOpacity=".2" stopColor="#fff" offset={0} />
                    <stop stopOpacity={0} stopColor="#fff" offset={1} />
                  </linearGradient>
                  <path
                    d="M23.7352295,9.5H12v5h6.4862061C17.4775391,17.121582,14.9771729,19,12,19 c-3.8659668,0-7-3.1340332-7-7c0-3.8660278,3.1340332-7,7-7c1.4018555,0,2.6939087,0.4306641,3.7885132,1.140686 c0.1675415,0.1088867,0.3403931,0.2111206,0.4978027,0.333374l3.637146-3.4699707L19.8414307,2.940979 C17.7369385,1.1170654,15.00354,0,12,0C5.3725586,0,0,5.3725586,0,12c0,6.6273804,5.3725586,12,12,12 c6.1176758,0,11.1554565-4.5812378,11.8960571-10.4981689C23.9585571,13.0101929,24,12.508667,24,12 C24,11.1421509,23.906311,10.3068237,23.7352295,9.5z"
                    fill="url(#LxT-gk5MfRc1Gl_4XsNKba_xoyhGXWmHnqX_gr1)"
                  />
                  <path
                    opacity=".1"
                    d="M15.7885132,5.890686C14.6939087,5.1806641,13.4018555,4.75,12,4.75c-3.8659668,0-7,3.1339722-7,7 c0,0.0421753,0.0005674,0.0751343,0.0012999,0.1171875C5.0687437,8.0595093,8.1762085,5,12,5 c1.4018555,0,2.6939087,0.4306641,3.7885132,1.140686c0.1675415,0.1088867,0.3403931,0.2111206,0.4978027,0.333374 l3.637146-3.4699707l-3.637146,3.2199707C16.1289062,6.1018066,15.9560547,5.9995728,15.7885132,5.890686z"
                  />
                  <path
                    opacity=".2"
                    d="M12,0.25c2.9750366,0,5.6829224,1.0983887,7.7792969,2.8916016l0.144165-0.1375122 l-0.110014-0.0958166C17.7089558,1.0843592,15.00354,0,12,0C5.3725586,0,0,5.3725586,0,12 c0,0.0421753,0.0058594,0.0828857,0.0062866,0.125C0.0740356,5.5558472,5.4147339,0.25,12,0.25z"
                    fill="#FFF"
                  />
                </svg>
                <span className="ml-2" onClick={handleGoogleSignup}>
                  Sign in with Google
                </span>
              </button>
              {/* <button className="flex items-center justify-center py-2 px-20 bg-white hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-blue-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg mt-4">
                <svg
                  viewBox="0 0 30 30"
                  height={30}
                  width={30}
                  y="0px"
                  x="0px"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M25.565,9.785c-0.123,0.077-3.051,1.702-3.051,5.305c0.138,4.109,3.695,5.55,3.756,5.55 c-0.061,0.077-0.537,1.963-1.947,3.94C23.204,26.283,21.962,28,20.076,28c-1.794,0-2.438-1.135-4.508-1.135 c-2.223,0-2.852,1.135-4.554,1.135c-1.886,0-3.22-1.809-4.4-3.496c-1.533-2.208-2.836-5.673-2.882-9 c-0.031-1.763,0.307-3.496,1.165-4.968c1.211-2.055,3.373-3.45,5.734-3.496c1.809-0.061,3.419,1.242,4.523,1.242 c1.058,0,3.036-1.242,5.274-1.242C21.394,7.041,23.97,7.332,25.565,9.785z M15.001,6.688c-0.322-1.61,0.567-3.22,1.395-4.247 c1.058-1.242,2.729-2.085,4.17-2.085c0.092,1.61-0.491,3.189-1.533,4.339C18.098,5.937,16.488,6.872,15.001,6.688z" />
                </svg>
                <span className="ml-2">Sign in with Apple</span>
              </button> */}
            </div>
          </div>
          <div className="mt-5">
            <button
              className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
              type="submit"
              onClick={handleSignUp}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
