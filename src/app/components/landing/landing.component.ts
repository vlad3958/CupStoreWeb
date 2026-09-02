import { Component, ApplicationRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface GalleryItem {
  image: string;
  size: 'wide' | 'tall' | 'square';
}

interface OrderForm {
  name: string;
  phone: string;
  email: string;
  quantity?: string;
  message: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  @ViewChild('formEl') formEl!: ElementRef<HTMLFormElement>;
  @ViewChild('thanksEl') thanksEl!: ElementRef<HTMLDivElement>;
  @ViewChild('errorEl') errorEl!: ElementRef<HTMLParagraphElement>;
  @ViewChild('submitBtn') submitBtn!: ElementRef<HTMLButtonElement>;

  constructor(private http: HttpClient, private appRef: ApplicationRef) {}

  heroVideoSrc = '/video/production.mp4';

  stats = [
    { num: '2500 шт', label: 'мінімальний тираж' },
    { num: '110 мл - 500 мл', label: 'обʼєми стаканчиків' },
  ];

  whyPoints = [
    { title: 'Тримає тепло', text: 'Повітряний прошарок між шарами ізолює гарячий напій — стаканчик приємно тримати в руці без рукава.' },
    { title: 'Тримає форму', text: 'Щільніша структура не деформується під вагою напою й не протікає — важливо для доставки та навиносу.' },
    { title: 'Тримає друк', text: 'Рівна щільна поверхня передає кольори лого точно, без розмиття та просвічування зсередини.' },
  ];

  gallery: GalleryItem[] = [
    { image: './images/work-3.jpg', size: 'wide' },
    { image: './images/work-2.jpg', size: 'tall' },
    { image: './images/work-4.jpg', size: 'tall' },
    { image: './images/work-5.jpeg', size: 'tall' },
    { image: './images/work-6.jpeg', size: 'tall' },
    { image: './images/work-7.jpeg', size: 'tall' },
    { image: './images/work-8.jpeg', size: 'tall' }
  ];

  steps = [
    { n: '01', title: 'Макет', text: 'Надсилаєте лого — ми готуємо макет і погоджуємо з вами кольори.' },
    { n: '02', title: 'Друк', text: 'Виконуємо офсетний повноколірний друк. За бажанням - використовуючи ламінацію на другому шарі.' },
    { n: '03', title: 'Формування', text: 'Стаканчик формується на лінії та проходить контроль якості.' },
    { n: '04', title: 'Пакування', text: 'Партія пакується під ваше замовлення й готується до відвантаження.' },
  ];

  order: OrderForm = { name: '', phone: '', email: '', quantity: '', message: '' };
  isSubmitting = false;

  onSubmit(form: NgForm): void {
    if (this.isSubmitting) return;

    // Позначаємо всі поля як "touched", щоб показати помилки валідації
    // навіть якщо користувач ще не взаємодіяв з полем перед сабмітом
    if (form.invalid) {
      Object.values(form.controls).forEach(control => control.markAsTouched());
      return;
    }

    this.isSubmitting = true;
    this.submitBtn.nativeElement.disabled = true;
    this.submitBtn.nativeElement.textContent = 'Надсилаємо…';
    this.hideError();

    this.http.post('https://formspree.io/f/moeqewep', this.order, {
      headers: { 'Accept': 'application/json' }
    }).subscribe({
      next: () => {
        this.formEl.nativeElement.style.display = 'none';
        this.thanksEl.nativeElement.style.display = 'block';
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting = false;
        this.submitBtn.nativeElement.disabled = false;
        this.submitBtn.nativeElement.textContent = 'Надіслати заявку';
        this.showError('Не вдалося надіслати заявку. Спробуйте ще раз.');
      }
    });
  }

  private showError(msg: string): void {
    this.errorEl.nativeElement.textContent = msg;
    this.errorEl.nativeElement.style.display = 'block';
  }

  private hideError(): void {
    this.errorEl.nativeElement.style.display = 'none';
  }
}