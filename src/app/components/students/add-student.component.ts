import {Component, OnInit} from '@angular/core';
import {StudentService} from './students.service';
import {MaktabClass, Student} from '../models/all.models';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaktabClassService} from '../classes/school-class.service';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AddStudentComponent implements OnInit {
  // Student form data
  student: Student = {
    id: 0,
    name: '',
    surName: '',
    rollNo: 0,
    age: 0,
    gender: 'Male',
    guardianName: '',
    phone: '',
    imagePath: '',
    fees: [],
    status: 'active',
    admissionDate: new Date().toISOString().split('T')[0],
    attendance: [],
    dob: '',
    fatherName: '',
    whatsapp: '',
    classId: 0,
    address: '',
    schoolName: '',
    parentProfession: '',
    preferredTime: ''
  };

  // UI state variables
  photoFile: File | null = null;
  photoPreview: string | null = null;
  uploadingPhoto: boolean = false;
  showCamera: boolean = false;
  stream: MediaStream | null = null;
  submitting: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  classes: MaktabClass[] = [];

  constructor(
    private studentService: StudentService,
    private classService: MaktabClassService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.getAll().subscribe({
      next: (data: MaktabClass[]) => {
        this.classes = data;
      },
      error: (error: any) => {
        console.error('Error loading classes:', error);
        this.showMessage('Failed to load classes', 'error');
      }
    });
  }

  /**
   * Get the photo URL - either preview, default or from server
   */
  getStudentPhotoUrl(): string {
    if (this.photoPreview) {
      return this.photoPreview;
    }
    return this.student?.gender === 'Male' ? 'assets/boy-default.png' : 'assets/girl-default.png';
  }

  async onPhotoSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file
      if (!this.isValidImageFile(file)) {
        this.showMessage('Please select a valid image file (JPG, PNG, GIF, WebP)', 'error');
        return;
      }
      this.photoFile = await this.compressImage(file);
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.showMessage('File size must be less than 5MB', 'error');
        return;
      }

      this.photoFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.photoPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Validate image file type
   */
  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
  }

  /**
   * Open camera modal for photo capture
   */
  openCamera(): void {
    this.showCamera = true;
    setTimeout(() => {
      const video = document.querySelector('#cameraVideo') as HTMLVideoElement;
      if (video) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'user' } })
          .then((mediaStream: MediaStream) => {
            this.stream = mediaStream;
            video.srcObject = mediaStream;
          })
          .catch((error: any) => {
            console.error('Error accessing camera:', error);
            this.showMessage('Unable to access camera. Please check permissions.', 'error');
          });
      }
    }, 100);
  }

  /**
   * Close camera modal and stop stream
   */
  closeCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      this.stream = null;
    }
    this.showCamera = false;
  }

  /**
   * Capture photo from camera
   */
  capturePhoto(video: HTMLVideoElement): void {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(video, 0, 0);
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
          this.photoFile = file;
          this.photoPreview = canvas.toDataURL('image/jpeg');
          this.closeCamera();
          this.showMessage('Photo captured successfully', 'success');
        }
      }, 'image/jpeg', 0.95);
    }
  }

  /**
   * Submit the form to save the student
   */
  submitForm(): void {
    // Validate required fields
    if (!this.student.name || !this.student.surName) {
      this.showMessage('Name and Surname are required', 'error');
      return;
    }

    if (!this.student.classId || this.student.classId === 0) {
      this.showMessage('Please select a class', 'error');
      return;
    }

    if (this.student.age <= 0) {
      this.showMessage('Please enter a valid age', 'error');
      return;
    }

    this.submitting = true;

    // If photo is selected, upload first
    if (this.photoFile) {
      this.uploadPhotoAndSaveStudent();
    } else {
      this.saveStudent();
    }
  }

  /**
   * Upload photo then save student
   */
  private uploadPhotoAndSaveStudent(): void {
    if (!this.photoFile) {
      this.saveStudent();
      return;
    }

    // Create a temporary FormData with the student data and photo
    const formData = new FormData();
    formData.append('file', this.photoFile);
    formData.append('studentData', JSON.stringify(this.student));

    // For new students, we'll save the student first without photo, then upload
    this.saveStudent();
  }

  /**
   * Save the student to the database
   */
  private saveStudent(): void {
    this.studentService.create(this.student).subscribe({
      next: (response: Student) => {
        this.submitting = false;
        this.showMessage('Student added successfully!', 'success');

        // If photo was selected, upload it
        if (this.photoFile && response.id) {
          this.uploadStudentPhoto(response.id);
        } else {
          // Navigate back to students list
          setTimeout(() => {
            this.router.navigate(['/students']);
          }, 1500);
        }
      },
      error: (error: any) => {
        this.submitting = false;
        console.error('Error saving student:', error);
        const errorMessage = error?.error?.message || 'Failed to add student';
        this.showMessage(errorMessage, 'error');
      }
    });
  }

  /**
   * Upload student photo
   */
  private uploadStudentPhoto(studentId: number): void {
    if (!this.photoFile) {
      return;
    }

    this.studentService.uploadStudentPhoto(studentId, this.photoFile).subscribe({
      next: (response: any) => {
        this.showMessage('Photo uploaded successfully!', 'success');
        setTimeout(() => {
          this.router.navigate(['/students']);
        }, 1500);
      },
      error: (error: any) => {
        console.error('Error uploading photo:', error);
        this.showMessage('Student added but photo upload failed', 'error');
        setTimeout(() => {
          this.router.navigate(['/students']);
        }, 1500);
      }
    });
  }

  /**
   * Show notification message
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  /**
   * Cancel and go back
   */
  cancel(): void {
    this.router.navigate(['/students']);
  }
  private compressImage(
    file: File,
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.50
  ): Promise<File> {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new Image();

      reader.onload = () => img.src = reader.result as string;
      reader.onerror = reject;

      img.onload = () => {
        let { width, height } = img;

        const scale = Math.min(
          maxWidth / width,
          maxHeight / height,
          1
        );

        width = Math.round(width * scale);
        height = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas not supported');

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          blob => {
            if (!blob) return reject('Compression failed');

            resolve(new File(
              [blob],
              file.name.replace(/\.\w+$/, '.jpg'),
              { type: 'image/jpeg' }
            ));
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

}

