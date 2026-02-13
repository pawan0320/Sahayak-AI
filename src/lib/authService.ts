import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
  User,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Firebase config (mock - replace with your actual config)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyDemoKey',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'sahayak-demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'sahayak-demo',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'sahayak-demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abc123',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set persistence
setPersistence(auth, browserLocalPersistence).catch((error: any) => {
  console.log('Persistence setup error:', error);
});

// ============================================
// TEACHER AUTH TYPES
// ============================================

export interface TeacherSignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  schoolName: string;
  subject: string;
  assignedClasses: string[];
  faceData?: string; // Base64 encoded face image
}

export interface TeacherProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  school: string;
  subject: string;
  assignedClasses: string[];
  faceData: string | null;
  attendanceLogs: AttendanceLog[];
  createdAt: Timestamp;
  lastLogin: Timestamp;
  role: 'teacher' | 'principal';
  faceVerificationEnabled: boolean;
  appLockEnabled: boolean;
  appLockTimeout: number; // minutes
  avatarStyle: string;
}

// ============================================
// STUDENT AUTH TYPES
// ============================================

export interface StudentSignupData {
  name: string;
  rollNo: string;
  class: string;
  section: string;
  schoolCode: string;
  parentPhone: string;
  pin?: string;
}

export interface StudentProfile {
  rollNo: string;
  name: string;
  class: string;
  section: string;
  schoolCode: string;
  parentPhone: string;
  pin: string;
  attendance: AttendanceRecord[];
  performance: PerformanceRecord[];
  languagePreference: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// ============================================
// ADMIN AUTH TYPES
// ============================================

export interface AdminSignupData {
  name: string;
  email: string;
  password: string;
  phone: string;
  adminType: 'super' | 'school' | 'district';
  schoolCode?: string;
  district?: string;
}

export interface AdminProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  adminType: 'super' | 'school' | 'district';
  schoolCode?: string;
  district?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
}

// ============================================
// COMMON TYPES
// ============================================

export interface AttendanceLog {
  date: Timestamp;
  loginMethod: 'email' | 'phone_otp' | 'face';
  timestamp: Timestamp;
  deviceId: string;
  sessionDuration: number; // minutes
  status: 'present' | 'absent' | 'late';
}

export interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'late';
  classSessionId: string;
}

export interface PerformanceRecord {
  classSessionId: string;
  topic: string;
  score: number;
  maxScore: number;
  date: Timestamp;
}

// ============================================
// AUTHENTICATION SERVICE
// ============================================

class AuthService {
  auth: Auth;
  db: any;

  constructor(authInstance: Auth, dbInstance: any) {
    this.auth = authInstance;
    this.db = dbInstance;
  }

  // ============================================
  // TEACHER AUTHENTICATION
  // ============================================

  async teacherSignup(data: TeacherSignupData): Promise<TeacherProfile> {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      const uid = userCredential.user.uid;

      // Generate device ID
      const deviceId = uuidv4();

      // Create teacher profile
      const teacherProfile: TeacherProfile = {
        uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        school: data.schoolName,
        subject: data.subject,
        assignedClasses: data.assignedClasses,
        faceData: data.faceData || null,
        attendanceLogs: [],
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        role: 'teacher',
        faceVerificationEnabled: !!data.faceData,
        appLockEnabled: true,
        appLockTimeout: 15,
        avatarStyle: 'default',
      };

      // Save to Firestore
      await setDoc(doc(this.db, 'teachers', uid), teacherProfile);
      await setDoc(doc(this.db, 'users', uid), {
        role: 'teacher',
        email: data.email,
        createdAt: Timestamp.now(),
      });

      // Log initial attendance
      await this.logTeacherAttendance(uid, 'email', deviceId);

      return teacherProfile;
    } catch (error: any) {
      throw new Error(`Teacher signup failed: ${error.message}`);
    }
  }

  async teacherLogin(email: string, password: string, deviceId: string): Promise<TeacherProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      // Get teacher profile
      const teacherDoc = await getDoc(doc(this.db, 'teachers', uid));
      if (!teacherDoc.exists()) {
        throw new Error('Teacher profile not found');
      }

      const teacherProfile = teacherDoc.data() as TeacherProfile;

      // Log attendance
      await this.logTeacherAttendance(uid, 'email', deviceId);

      // Update last login
      await setDoc(
        doc(this.db, 'teachers', uid),
        { lastLogin: Timestamp.now() },
        { merge: true }
      );

      return teacherProfile;
    } catch (error: any) {
      throw new Error(`Teacher login failed: ${error.message}`);
    }
  }

  async teacherLoginWithFace(uid: string, deviceId: string): Promise<TeacherProfile> {
    try {
      const teacherDoc = await getDoc(doc(this.db, 'teachers', uid));
      if (!teacherDoc.exists()) {
        throw new Error('Teacher not found');
      }

      const teacherProfile = teacherDoc.data() as TeacherProfile;

      if (!teacherProfile.faceVerificationEnabled || !teacherProfile.faceData) {
        throw new Error('Face verification not enabled for this teacher');
      }

      // Log attendance with face
      await this.logTeacherAttendance(uid, 'face', deviceId);

      // Update last login
      await setDoc(
        doc(this.db, 'teachers', uid),
        { lastLogin: Timestamp.now() },
        { merge: true }
      );

      return teacherProfile;
    } catch (error: any) {
      throw new Error(`Teacher face login failed: ${error.message}`);
    }
  }

  async logTeacherAttendance(uid: string, loginMethod: 'email' | 'phone_otp' | 'face', deviceId: string): Promise<void> {
    try {
      const now = Timestamp.now();
      const attendanceLog: AttendanceLog = {
        date: new Timestamp(Math.floor(Date.now() / 1000 / 86400) * 86400, 0),
        loginMethod,
        timestamp: now,
        deviceId,
        sessionDuration: 0,
        status: 'present',
      };

      const teacherDoc = await getDoc(doc(this.db, 'teachers', uid));
      if (teacherDoc.exists()) {
        const existingLogs = (teacherDoc.data() as TeacherProfile).attendanceLogs || [];
        await setDoc(
          doc(this.db, 'teachers', uid),
          { attendanceLogs: [...existingLogs, attendanceLog] },
          { merge: true }
        );
      }
    } catch (error) {
      console.error('Failed to log teacher attendance:', error);
    }
  }

  // ============================================
  // STUDENT AUTHENTICATION
  // ============================================

  async studentSignup(data: StudentSignupData): Promise<StudentProfile> {
    try {
      // Check if student already exists
      const existingStudent = await getDoc(doc(this.db, 'students', data.rollNo));
      if (existingStudent.exists()) {
        throw new Error('Student with this roll number already exists');
      }

      // Generate default PIN if not provided
      const pin = data.pin || Math.random().toString().slice(2, 6);

      // Create student profile (no auth required for students)
      const studentProfile: StudentProfile = {
        rollNo: data.rollNo,
        name: data.name,
        class: data.class,
        section: data.section,
        schoolCode: data.schoolCode,
        parentPhone: data.parentPhone,
        pin,
        attendance: [],
        performance: [],
        languagePreference: 'en',
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
      };

      // Save to Firestore
      await setDoc(doc(this.db, 'students', data.rollNo), studentProfile);
      await setDoc(doc(this.db, 'studentIndex', `${data.schoolCode}_${data.rollNo}`), {
        rollNo: data.rollNo,
        schoolCode: data.schoolCode,
        class: data.class,
      });

      return studentProfile;
    } catch (error: any) {
      throw new Error(`Student signup failed: ${error.message}`);
    }
  }

  async studentLogin(rollNo: string, schoolCode: string, pin: string): Promise<StudentProfile> {
    try {
      const studentDoc = await getDoc(doc(this.db, 'students', rollNo));
      if (!studentDoc.exists()) {
        throw new Error('Student not found');
      }

      const studentProfile = studentDoc.data() as StudentProfile;

      // Verify school code
      if (studentProfile.schoolCode !== schoolCode) {
        throw new Error('Invalid school code');
      }

      // Verify PIN
      if (studentProfile.pin !== pin) {
        throw new Error('Invalid PIN');
      }

      // Update last login
      await setDoc(
        doc(this.db, 'students', rollNo),
        { lastLogin: Timestamp.now() },
        { merge: true }
      );

      return studentProfile;
    } catch (error: any) {
      throw new Error(`Student login failed: ${error.message}`);
    }
  }

  // ============================================
  // ADMIN AUTHENTICATION
  // ============================================

  async adminSignup(data: AdminSignupData): Promise<AdminProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, data.email, data.password);
      const uid = userCredential.user.uid;

      const adminProfile: AdminProfile = {
        uid,
        name: data.name,
        email: data.email,
        phone: data.phone,
        adminType: data.adminType,
        schoolCode: data.schoolCode,
        district: data.district,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
      };

      await setDoc(doc(this.db, 'admins', uid), adminProfile);
      await setDoc(doc(this.db, 'users', uid), {
        role: 'admin',
        email: data.email,
        createdAt: Timestamp.now(),
      });

      return adminProfile;
    } catch (error: any) {
      throw new Error(`Admin signup failed: ${error.message}`);
    }
  }

  async adminLogin(email: string, password: string): Promise<AdminProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = userCredential.user.uid;

      const adminDoc = await getDoc(doc(this.db, 'admins', uid));
      if (!adminDoc.exists()) {
        throw new Error('Admin profile not found');
      }

      const adminProfile = adminDoc.data() as AdminProfile;

      await setDoc(
        doc(this.db, 'admins', uid),
        { lastLogin: Timestamp.now() },
        { merge: true }
      );

      return adminProfile;
    } catch (error: any) {
      throw new Error(`Admin login failed: ${error.message}`);
    }
  }

  // ============================================
  // COMMON METHODS
  // ============================================

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async getUserRole(uid: string): Promise<'teacher' | 'student' | 'admin' | null> {
    try {
      const userDoc = await getDoc(doc(this.db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data().role;
      }
      return null;
    } catch (error) {
      console.error('Failed to get user role:', error);
      return null;
    }
  }

  async getTeacherProfile(uid: string): Promise<TeacherProfile | null> {
    try {
      const doc_ref = await getDoc(doc(this.db, 'teachers', uid));
      if (doc_ref.exists()) {
        return doc_ref.data() as TeacherProfile;
      }
      return null;
    } catch (error) {
      console.error('Failed to get teacher profile:', error);
      return null;
    }
  }

  async getStudentProfile(rollNo: string): Promise<StudentProfile | null> {
    try {
      const doc_ref = await getDoc(doc(this.db, 'students', rollNo));
      if (doc_ref.exists()) {
        return doc_ref.data() as StudentProfile;
      }
      return null;
    } catch (error) {
      console.error('Failed to get student profile:', error);
      return null;
    }
  }

  async getAdminProfile(uid: string): Promise<AdminProfile | null> {
    try {
      const doc_ref = await getDoc(doc(this.db, 'admins', uid));
      if (doc_ref.exists()) {
        return doc_ref.data() as AdminProfile;
      }
      return null;
    } catch (error) {
      console.error('Failed to get admin profile:', error);
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService(auth, db);
export { auth, db };
