---
subject: math
title: Тест уровня по математике
---

@block arith
title: Арифметика и дроби
level: 0
start: numbers
covers: numbers, fractions, negatives
about: действия с дробями и отрицательными числами

@task num 1
Вычислите $\dfrac34+\dfrac56$. Ответ можно записать обыкновенной дробью, например `7/4`.
@answer 19/12
@solution
Общий знаменатель 12: $\frac{9}{12}+\frac{10}{12}=\frac{19}{12}$.

@task num 1
Вычислите $(-3)\cdot(-4)-20:(-5)$.
@answer 16
@solution
$12-(-4)=16$.

@task num 1
Вычислите $1{,}2:0{,}03$.
@answer 40
@solution
$1{,}2:0{,}03=120:3=40$.

@block percent
title: Проценты и степени
level: 0
start: percent
covers: percent, powers
about: проценты, свойства степеней и корней

@task num 1
Цена 800 рублей выросла на 15%. Сколько рублей стоит товар теперь?
@answer 920
@solution
$800\cdot1{,}15=920$.

@task num 1
Вычислите $2^5\cdot 2^{-3}$.
@answer 4
@solution
$2^{5-3}=2^2=4$.

@task num 1
Вычислите $\sqrt{50}\cdot\sqrt{2}$.
@answer 10
@solution
$\sqrt{100}=10$.

@block equations
title: Выражения и линейные уравнения
level: 0
start: expressions
covers: expressions, linear-eq, systems
about: формулы сокращённого умножения, уравнения, системы

@task num 1
Решите уравнение $3(x-2)=x+4$.
@answer 5
@solution
$3x-6=x+4$, $2x=10$, $x=5$.

@task num 1
Вычислите $101^2-99^2$ (подсказка: есть способ без длинного умножения).
@answer 400
@solution
Разность квадратов: $(101-99)(101+99)=2\cdot200=400$.

@task num 1
Решите систему $\begin{cases}x+y=7\\ x-y=1\end{cases}$ и найдите произведение $xy$.
@answer 12
@solution
Складываем: $2x=8$, $x=4$, $y=3$, $xy=12$.

@block quadratic
title: Квадратные уравнения и графики
level: 0
start: quadratic
covers: quadratic, algebraic-fractions, functions-basic
about: дискриминант, парабола, прямая

@task set 1
Решите уравнение $x^2-5x+6=0$. Если корней несколько, запишите их через точку с запятой.
@answer 2; 3
@solution
По теореме Виета корни 2 и 3.

@task num 1
Найдите абсциссу вершины параболы $y=x^2-6x+5$.
@answer 3
@solution
$x_0=-\dfrac{b}{2a}=3$.

@task num 1
Прямая проходит через точки $(0;\,1)$ и $(2;\,5)$. Найдите её угловой коэффициент $k$ в уравнении $y=kx+b$.
@answer 2
@solution
$k=\dfrac{5-1}{2-0}=2$.

@block geometry
title: Планиметрия
level: 0
start: geometry-triangles
covers: geometry-triangles, geometry-area
about: треугольники, теорема Пифагора, площади

@task num 1
Катеты прямоугольного треугольника равны 6 и 8. Найдите гипотенузу.
@answer 10
@solution
$\sqrt{36+64}=10$.

@task num 1
Найдите площадь круга радиуса 3. Ответ можно записать с $\pi$, например `4pi`.
@answer 9pi
@solution
$S=\pi r^2=9\pi$.

@task num 1
Два угла треугольника равны $50^\circ$ и $60^\circ$. Найдите третий угол в градусах.
@answer 70
@solution
$180-50-60=70$.

@block trig
title: Тригонометрия
level: 1
start: trig-basics
covers: trig-basics, trig-formulas, trig-equations
about: синус, косинус, формулы, уравнения

@task num 1
Вычислите $\sin\dfrac{\pi}{6}$.
@answer 1/2
@solution
$\sin 30^\circ=\frac12$.

@task num 2
Известно, что $\sin\alpha=0{,}6$ и $0<\alpha<\dfrac\pi2$. Найдите $\tg\alpha$.
@answer 0.75
@solution
$\cos\alpha=\sqrt{1-0{,}36}=0{,}8$, $\tg\alpha=0{,}6/0{,}8=0{,}75$.

@task num 2
Найдите наименьший положительный корень уравнения $\cos 2x=0$. Ответ — в радианах, например `pi/3`.
@answer pi/4
@solution
$2x=\frac\pi2+\pi k$, $x=\frac\pi4+\frac{\pi k}2$. Наименьший положительный: $\frac\pi4$.

@block explog
title: Показательная функция и логарифмы
level: 1
start: exp-func
covers: exp-func, logarithms
about: показательные уравнения, свойства логарифмов

@task num 1
Вычислите $\log_2 32$.
@answer 5
@solution
$2^5=32$.

@task num 1
Решите уравнение $2^{x+1}=16$.
@answer 3
@solution
$2^{x+1}=2^4$, $x=3$.

@task num 2
Вычислите $\lg 4+\lg 25$.
@answer 2
@solution
$\lg(4\cdot25)=\lg100=2$.

@block school-misc
title: Неравенства, прогрессии, вероятность
level: 1
start: inequalities
covers: inequalities, sequences, combinatorics, probability-school
about: метод интервалов, прогрессии, комбинаторика

@task num 1
Сколько целых чисел удовлетворяют неравенству $(x-1)(x-5)<0$?
@answer 3
@solution
Решение $1<x<5$, целые: 2, 3, 4.

@task num 1
Арифметическая прогрессия: $a_1=3$, разность $d=4$. Найдите $a_{10}$.
@answer 39
@solution
$a_{10}=a_1+9d=3+36=39$.

@task num 2
Игральную кость бросают один раз. Найдите вероятность того, что выпадет чётное число, большее 3.
@answer 1/3
@solution
Подходят 4 и 6: $\frac26=\frac13$.

@block derivative
title: Производная
level: 1
start: derivative-school
covers: derivative-school, derivative-app
about: таблица производных, касательная, экстремумы

@task num 1
Найдите $f'(1)$, если $f(x)=x^3-2x$.
@answer 1
@solution
$f'(x)=3x^2-2$, $f'(1)=1$.

@task num 2
Найдите значение производной функции $y=\sin 2x$ в точке $x=0$.
@answer 2
@solution
$y'=2\cos2x$, $y'(0)=2$.

@task num 2
Найдите точку максимума функции $y=x^3-3x$.
@answer -1
@solution
$y'=3x^2-3=0$ при $x=\pm1$. Производная меняет знак с плюса на минус в точке $x=-1$.

@block integral
title: Первообразная и интеграл
level: 1
start: integral-school
covers: integral-school, vectors-coord, stereometry
about: формула Ньютона — Лейбница, площадь

@task num 1
Вычислите $\displaystyle\int_0^2 x\,dx$.
@answer 2
@solution
$\frac{x^2}2\Big|_0^2=2$.

@task num 2
Вычислите $\displaystyle\int_0^\pi \sin x\,dx$.
@answer 2
@solution
$-\cos x\Big|_0^\pi=1+1=2$.

@task num 2
Найдите площадь фигуры, ограниченной графиком $y=x^2$, осью $Ox$ и прямой $x=3$.
@answer 9
@solution
$\int_0^3x^2dx=\frac{27}3=9$.

@block limits
title: Пределы
level: 2
start: limit-seq
covers: sets-logic, limit-seq, limit-func, continuity
about: предел последовательности, замечательные пределы

@task num 1
Найдите $\displaystyle\lim_{n\to\infty}\frac{3n^2+1}{n^2-n}$.
@answer 3
@solution
Делим на $n^2$: $\frac{3+1/n^2}{1-1/n}\to3$.

@task num 2
Найдите $\displaystyle\lim_{x\to0}\frac{\sin 5x}{x}$.
@answer 5
@solution
$\frac{\sin5x}{5x}\cdot5\to5$.

@task num 2
Найдите $\displaystyle\lim_{x\to\infty}\left(1+\frac2x\right)^x$. Число $e$ записывается как `e`.
@answer e^2
@solution
Второй замечательный предел: $\left(\left(1+\frac2x\right)^{x/2}\right)^2\to e^2$.

@block derivative2
title: Дифференциальное исчисление
level: 2
start: derivative
covers: derivative, lhopital-taylor, function-study
about: сложные производные, Лопиталь, Тейлор

@task num 2
Найдите производную функции $y=x^x$ в точке $x=1$.
@answer 1
@solution
$\ln y=x\ln x$, $\frac{y'}{y}=\ln x+1$, $y'=x^x(\ln x+1)$, при $x=1$: $1$.

@task num 2
Найдите $\displaystyle\lim_{x\to0}\frac{e^x-1-x}{x^2}$.
@answer 1/2
@solution
$e^x=1+x+\frac{x^2}2+o(x^2)$, предел $\frac12$.

@task num 2
Найдите коэффициент при $x^3$ в разложении $\sin x$ по формуле Тейлора в точке 0.
@answer -1/6
@solution
$\sin x=x-\frac{x^3}{6}+\dots$

@block integrals2
title: Техника интегрирования
level: 2
start: indefinite-integral
covers: indefinite-integral, rational-integration, definite-integral, improper-integral
about: по частям, замена, несобственные интегралы

@task num 2
Вычислите $\displaystyle\int_0^1 x e^x\,dx$.
@answer 1
@solution
По частям: $(x-1)e^x\Big|_0^1=0-(-1)=1$.

@task num 2
Вычислите $\displaystyle\int_1^{+\infty}\frac{dx}{x^2}$.
@answer 1
@solution
$-\frac1x\Big|_1^{\infty}=1$.

@task num 2
Вычислите $\displaystyle\int_0^1\frac{2x}{1+x^2}\,dx$. Логарифм записывается как `ln(...)`.
@answer ln(2)
@solution
Замена $t=1+x^2$: $\ln(1+x^2)\Big|_0^1=\ln2$.

@block complex
title: Комплексные числа
level: 2
start: complex
covers: complex, polynomials
about: алгебраическая и тригонометрическая форма

@task cnum 1
Вычислите $(1+i)^2$. Мнимая единица записывается как `i`.
@answer 2i
@solution
$1+2i+i^2=2i$.

@task num 1
Найдите модуль числа $3-4i$.
@answer 5
@solution
$\sqrt{9+16}=5$.

@task cnum 2
Вычислите $\dfrac{1+i}{1-i}$.
@answer i
@solution
Домножим на сопряжённое: $\frac{(1+i)^2}{2}=\frac{2i}2=i$.

@block linalg
title: Матрицы и системы
level: 2
start: matrices
covers: matrices, determinants, linear-systems
about: определители, ранг, системы уравнений

@task num 1
Вычислите определитель $\begin{vmatrix}2&1\\3&4\end{vmatrix}$.
@answer 5
@solution
$2\cdot4-1\cdot3=5$.

@task num 2
Вычислите определитель $\begin{vmatrix}1&2&3\\0&2&4\\0&0&5\end{vmatrix}$.
@answer 10
@solution
Матрица треугольная: произведение диагонали $1\cdot2\cdot5=10$.

@task num 2
Найдите ранг матрицы $\begin{pmatrix}1&2&3\\2&4&6\\1&0&1\end{pmatrix}$.
@answer 2
@solution
Вторая строка — удвоенная первая, первая и третья не пропорциональны: ранг 2.

@block analytic
title: Векторы и аналитическая геометрия
level: 2
start: vector-algebra
covers: vector-algebra, lines-planes, conics
about: скалярное и векторное произведения, прямые и плоскости

@task num 1
Найдите длину вектора $\vec a=(1;\,2;\,2)$.
@answer 3
@solution
$\sqrt{1+4+4}=3$.

@task num 1
Найдите скалярное произведение векторов $(1;\,2;\,3)$ и $(4;\,-5;\,6)$.
@answer 12
@solution
$4-10+18=12$.

@task num 2
Найдите расстояние от точки $(1;\,2;\,3)$ до плоскости $2x+y-2z+5=0$.
@answer 1
@solution
$\frac{|2+2-6+5|}{\sqrt{4+1+4}}=\frac33=1$.

@block series
title: Ряды
level: 3
start: number-series
covers: number-series, power-series, fourier-series
about: сходимость, сумма, радиус сходимости

@task num 1
Найдите сумму ряда $\displaystyle\sum_{n=0}^{\infty}\frac{1}{2^n}$.
@answer 2
@solution
Геометрическая прогрессия: $\frac{1}{1-1/2}=2$.

@task num 2
Найдите радиус сходимости степенного ряда $\displaystyle\sum_{n=1}^{\infty}\frac{x^n}{3^n}$.
@answer 3
@solution
$R=\lim\frac{3^{n+1}}{3^n}=3$.

@task choice 2
Какой из рядов сходится?
@opt $\sum\frac1n$
@opt $\sum\frac{1}{\sqrt n}$
@opt* $\sum\frac{1}{n^2}$
@opt $\sum\frac{n}{n+1}$
@solution
$\sum\frac1{n^p}$ сходится при $p>1$. У последнего ряда общий член не стремится к нулю.

@block multivar
title: Функции многих переменных
level: 3
start: multivar-diff
covers: multivar-diff, multivar-extrema, multiple-integrals, line-surface-integrals, vector-calculus
about: частные производные, кратные интегралы, теория поля

@task num 1
Найдите $\dfrac{\partial f}{\partial x}$ в точке $(1;\,2)$, если $f=x^2y^3$.
@answer 16
@solution
$f'_x=2xy^3=2\cdot8=16$.

@task num 2
Вычислите $\displaystyle\iint_D xy\,dx\,dy$, где $D=[0;1]\times[0;2]$.
@answer 1
@solution
$\int_0^1x\,dx\cdot\int_0^2y\,dy=\frac12\cdot2=1$.

@task num 2
Найдите дивергенцию поля $\vec F=(x^2,\,y^2,\,z^2)$ в точке $(1;\,1;\,1)$.
@answer 6
@solution
$\Div\vec F=2x+2y+2z=6$.

@block ode
title: Дифференциальные уравнения
level: 3
start: ode-first
covers: ode-first, ode-linear, ode-systems
about: разделяющиеся переменные, линейные уравнения

@task num 2
Решите задачу Коши $y'=2xy$, $y(0)=1$ и найдите $y(1)$.
@answer e
@solution
$\frac{dy}y=2x\,dx$, $y=Ce^{x^2}$, $C=1$, $y(1)=e$.

@task num 2
Решите задачу Коши $y''-3y'+2y=0$, $y(0)=0$, $y'(0)=1$ и найдите $y(1)$.
@answer e^2-e
@solution
Корни $1$ и $2$: $y=C_1e^x+C_2e^{2x}$, из условий $y=e^{2x}-e^x$.

@task num 2
Найдите период решений уравнения $y''+4y=0$ (кроме нулевого). Ответ с $\pi$.
@answer pi
@solution
$y=C_1\cos2x+C_2\sin2x$, период $\frac{2\pi}2=\pi$.

@block linalg2
title: Линейные пространства и собственные числа
level: 3
start: linear-spaces
covers: linear-spaces, eigen, quadratic-forms
about: размерность, базис, собственные значения

@task set 2
Найдите собственные значения матрицы $\begin{pmatrix}4&1\\2&3\end{pmatrix}$.
@answer 2; 5
@solution
$\lambda^2-7\lambda+10=0$, $\lambda=2,\ 5$.

@task num 2
Найдите размерность пространства решений уравнения $x+y+z=0$ в $\R^3$.
@answer 2
@solution
Одно уравнение на три неизвестные: две свободные переменные.

@task num 2
При каком наибольшем целом $a$ квадратичная форма $x^2+2axy+5y^2$ положительно определена?
@answer 2
@solution
Критерий Сильвестра: $5-a^2>0$, $|a|<\sqrt5$. Наибольшее целое — 2.

@block probability
title: Теория вероятностей и статистика
level: 4
start: probability
covers: probability, random-variables, limit-theorems, statistics
about: события, случайные величины, дисперсия

@task num 1
Монету бросают 3 раза. Найдите вероятность того, что хотя бы раз выпадет орёл.
@answer 7/8
@solution
$1-\left(\frac12\right)^3=\frac78$.

@task num 2
События $A$ и $B$ независимы, $P(A)=0{,}3$, $P(B)=0{,}5$. Найдите $P(A\cup B)$.
@answer 0.65
@solution
$0{,}3+0{,}5-0{,}15=0{,}65$.

@task num 2
Случайная величина равномерно распределена на отрезке $[0;\,2]$. Найдите её дисперсию.
@answer 1/3
@solution
$D=\frac{(b-a)^2}{12}=\frac4{12}=\frac13$.

@block tfkp
title: Комплексный анализ и операционное исчисление
level: 4
start: complex-analysis
covers: complex-analysis, residues, laplace, fourier-transform
about: вычеты, контурные интегралы, преобразование Лапласа

@task num 2
Найдите вычет функции $\dfrac{1}{z(z-2)}$ в точке $z=0$.
@answer -1/2
@solution
$\Res_{z=0}=\frac{1}{z-2}\Big|_{z=0}=-\frac12$.

@task cnum 2
Вычислите $\displaystyle\oint_{|z|=1}\frac{dz}{z}$ (обход против часовой стрелки).
@answer 2pi*i
@solution
Классический интеграл: $2\pi i$.

@task num 2
Изображение по Лапласу функции $e^{3t}$ — это $F(p)$. Найдите $F(5)$.
@answer 1/2
@solution
$F(p)=\frac{1}{p-3}$, $F(5)=\frac12$.

@block matphys
title: Матфизика и численные методы
level: 4
start: pde-classification
covers: pde-classification, pde-fourier, calculus-variations, numerical-1, numerical-2
about: тип уравнения, метод Ньютона, квадратурные формулы

@task choice 2
К какому типу относится уравнение $u_{xx}+4u_{xy}+u_{yy}=0$?
@opt* гиперболическому
@opt параболическому
@opt эллиптическому
@solution
$B^2-AC=2^2-1\cdot1=3>0$ — гиперболическое.

@task num 2
Метод Ньютона для уравнения $x^2-2=0$ с начальным приближением $x_0=1$. Найдите $x_1$.
@answer 1.5
@solution
$x_1=x_0-\frac{x_0^2-2}{2x_0}=1+\frac12=1{,}5$.

@task num 2
Вычислите $\int_0^2x^2dx$ по формуле трапеций с шагом $h=1$.
@answer 3
@solution
$h\left(\frac{0}{2}+1+\frac42\right)=3$.

@block advanced
title: Специальные главы
level: 5
start: graphs
covers:
about: оптимизация, управление, случайные процессы

@task num 3
Найдите максимум $x+y$ при условиях $x+2y\le4$, $3x+y\le6$, $x\ge0$, $y\ge0$.
@answer 14/5
@solution
Максимум достигается в вершине многоугольника. Вершины: $(0;0)$, $(2;0)$, $(0;2)$ и пересечение прямых $x+2y=4$, $3x+y=6$: $\left(\frac85;\frac65\right)$, где $x+y=\frac{14}5$.

@task num 3
Передаточная функция звена $W(p)=\dfrac{1}{p+2}$. К какому значению стремится выходной сигнал при единичном ступенчатом входе?
@answer 1/2
@solution
Установившееся значение равно $W(0)=\frac12$.

@task num 3
Цепь Маркова с двумя состояниями: из состояния 1 переход в 2 с вероятностью 0,2, из 2 в 1 — с вероятностью 0,3. Найдите стационарную вероятность состояния 1.
@answer 0.6
@solution
$\pi_1\cdot0{,}2=\pi_2\cdot0{,}3$, $\pi_1+\pi_2=1$: $\pi_1=0{,}6$.
