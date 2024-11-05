import Link from 'next/link';
import Logo from '@/assets/Logomarca_2x.png'
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-primary text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">
            <Link href="/">
                <Image src={Logo} alt="Logo Aurumwm" className="w-auto h-[7vh]" />
            </Link>
        </div>

        <ul className="flex space-x-6">
          <li>
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/execucao-unica" className="hover:text-gray-300 transition-colors">
              Criar Execução Única
            </Link>
          </li>
          <li>
            <Link href="/agendamentos" className="hover:text-gray-300 transition-colors">
              Ver Agendamentos
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
