export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <div className="mb-6 inline-flex w-fit rounded-full bg-gray-100 px-4 py-2 text-sm font-medium">
          Kandidati • დასაქმების ახალი გამოცდილება
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          სამსახურის ძიებისა და შერჩევის
          <span className="block">უფრო მარტივი და გამჭვირვალე გზა.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Kandidati აერთიანებს ვაკანსიებს, კანდიდატის პროფილს, განაცხადების
          სტატუსის თრექინგს, ინტერვიუს დაჯავშნას და AI-ზე დაფუძნებულ
          recruitment tools-ს ერთ სივრცეში.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="#jobs"
            className="rounded-xl bg-black px-6 py-3 text-center font-semibold text-white transition hover:opacity-80"
          >
            ვაკანსიების ნახვა
          </a>

          <a
            href="#employers"
            className="rounded-xl border border-gray-300 px-6 py-3 text-center font-semibold transition hover:bg-gray-50"
          >
            დამსაქმებელი ვარ
          </a>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold">ერთი პროფილი</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              შექმენი პროფესიული პროფილი ერთხელ და გამოიყენე ყველა განაცხადისთვის.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold">რეალურ დროში სტატუსი</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              ყოველთვის იცოდე, ნახეს თუ არა შენი განაცხადი და რომელ ეტაპზე ხარ.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold">AI დახმარება HR-სთვის</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              სწრაფი screening, smart filtering და კანდიდატების უკეთესი matching.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold">ინტერვიუს თვითდაჯავშნა</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              კანდიდატი თავად ირჩევს დამსაქმებლის კალენდარში თავისუფალ დროს.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}