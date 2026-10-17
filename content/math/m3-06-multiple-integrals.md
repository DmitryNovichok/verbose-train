---
id: multiple-integrals
title: Двойные и тройные интегралы
level: 3
module: Функции многих переменных
hours: 6
prereq: definite-integral, multivar-diff
summary: Двойной интеграл и его сведение к повторному, смена порядка интегрирования, полярные координаты, тройные интегралы в цилиндрических и сферических координатах, якобиан, приложения.
---

## Двойной интеграл

Определение — как у обычного интеграла, только область $D$ на плоскости разбивается на маленькие площадки:
$$\iint_Df(x,y)\,dx\,dy=\lim\sum f(\xi_i,\eta_i)\,\Delta S_i.$$
Смысл: объём под поверхностью $z=f(x,y)$ над областью $D$; при $f=1$ — площадь области; при $f=\rho$ — масса пластины с плотностью $\rho$.

## Сведение к повторному

:::thm Теорема Фубини
Если $D=\{a\le x\le b,\ y_1(x)\le y\le y_2(x)\}$, то
$$\iint_Df\,dx\,dy=\int_a^bdx\int_{y_1(x)}^{y_2(x)}f(x,y)\,dy.$$
:::

Сначала интегрируем по $y$, считая $x$ константой; результат — функция от $x$, которую интегрируем по $x$. Пределы внутреннего интеграла могут зависеть от внешней переменной, а внешние — только числа.

:::example Вычислите $\iint_Dx\,dx\,dy$, $D$ — треугольник $x\ge0$, $y\ge0$, $x+y\le1$.
$\int_0^1dx\int_0^{1-x}x\,dy=\int_0^1x(1-x)\,dx=\frac12-\frac13=\frac16$.
:::

**Смена порядка интегрирования** — нарисуйте область и опишите её «в другую сторону». Иногда только так интеграл берётся:
$$\int_0^1dx\int_x^1e^{y^2}dy=\int_0^1dy\int_0^ye^{y^2}dx=\int_0^1ye^{y^2}dy=\frac{e-1}2.$$

## Замена переменных и полярные координаты

При замене $x=x(u,v)$, $y=y(u,v)$ площадка меняется в $|J|$ раз, где $J$ — **якобиан**:
$$dx\,dy=|J|\,du\,dv,\qquad J=\begin{vmatrix}x'_u&x'_v\\y'_u&y'_v\end{vmatrix}.$$

**Полярные координаты** $x=r\cos\varphi$, $y=r\sin\varphi$: $J=r$, то есть $dx\,dy=r\,dr\,d\varphi$. Удобны для кругов, колец, секторов и функций от $x^2+y^2$.

:::example Найдите $\iint\limits_{x^2+y^2\le4}(x^2+y^2)\,dx\,dy$.
$\int_0^{2\pi}d\varphi\int_0^2r^2\cdot r\,dr=2\pi\cdot4=8\pi$.
:::

:::example Интеграл Пуассона
$I=\int_{-\infty}^{\infty}e^{-x^2}dx$. Тогда $I^2=\iint_{\R^2}e^{-(x^2+y^2)}dxdy=\int_0^{2\pi}d\varphi\int_0^\infty e^{-r^2}r\,dr=2\pi\cdot\frac12=\pi$, $I=\sqrt\pi$.
:::

## Тройной интеграл

$\iiint_Vf\,dx\,dy\,dz$ — масса тела с плотностью $f$, при $f=1$ — объём. Сводится к трём повторным.

**Цилиндрические координаты** $(r,\varphi,z)$: $dV=r\,dr\,d\varphi\,dz$ — для цилиндров, конусов, параболоидов.

**Сферические** $(r,\theta,\varphi)$: $x=r\sin\theta\cos\varphi$, $y=r\sin\theta\sin\varphi$, $z=r\cos\theta$, $dV=r^2\sin\theta\,dr\,d\theta\,d\varphi$ — для шаров и всего, что зависит от расстояния до центра.

:::example Объём шара радиуса $R$.
$\int_0^{2\pi}d\varphi\int_0^\pi\sin\theta\,d\theta\int_0^Rr^2dr=2\pi\cdot2\cdot\frac{R^3}3=\frac43\pi R^3$.
:::

## Приложения

| Величина | Формула |
|---|---|
| площадь, объём | $\iint dS$, $\iiint dV$ |
| масса | $m=\iiint\rho\,dV$ |
| центр масс | $x_c=\frac1m\iiint x\rho\,dV$ |
| момент инерции относительно оси $z$ | $I_z=\iiint(x^2+y^2)\rho\,dV$ |

:::formulas
- $\iint_Df\,dxdy=\int_a^bdx\int_{y_1(x)}^{y_2(x)}f\,dy$ — сведение к повторному
- $dx\,dy=r\,dr\,d\varphi$ — полярные координаты
- $dV=r\,dr\,d\varphi\,dz$ — цилиндрические координаты
- $dV=r^2\sin\theta\,dr\,d\theta\,d\varphi$ — сферические координаты
- $dx\,dy=|J|\,du\,dv$ — замена переменных
- $I_z=\iiint(x^2+y^2)\rho\,dV$ — момент инерции
:::

@tasks

@task num 1
Вычислите $\iint\limits_{[0;1]\times[0;2]}(x+y)\,dx\,dy$.
@answer 3
@solution
$\int_0^1(2x+2)dx=1+2=3$.

@task num 1
Найдите $\iint_Dx\,dx\,dy$ по треугольнику $x\ge0$, $y\ge0$, $x+y\le1$.
@answer 1/6
@solution
См. пример.

@task num 2
Вычислите $\iint\limits_{x^2+y^2\le4}(x^2+y^2)\,dx\,dy$. Ответ с `pi`.
@answer 8pi
@solution
См. пример.

@task num 2
Найдите объём тела под параболоидом $z=4-x^2-y^2$ над плоскостью $z=0$. Ответ с `pi`.
@answer 8pi
@solution
$\int_0^{2\pi}d\varphi\int_0^2(4-r^2)r\,dr=2\pi(8-4)=8\pi$.

@task num 1
Вычислите $\iiint xyz\,dV$ по кубу $[0;1]^3$.
@answer 1/8
@solution
$\left(\frac12\right)^3$.

@task num 2
Найдите объём шара радиуса 2 в сферических координатах. Ответ с `pi`.
@answer 32pi/3
@solution
$\frac43\pi\cdot8$.

@task num 3
Вычислите $\displaystyle\int_0^1dx\int_x^1e^{y^2}dy$.
@answer (e-1)/2
@solution
См. пример со сменой порядка.

@task num 1
Найдите якобиан сферических координат в точке $r=2$, $\theta=\frac\pi2$.
@answer 4
@solution
$r^2\sin\theta=4$.

@task num 2
Найдите массу квадратной пластины $[0;1]^2$ с плотностью $\rho=x+y$.
@answer 1
@solution
$\int_0^1\int_0^1(x+y)\,dx\,dy=\frac12+\frac12=1$.

@task num 2
Найдите абсциссу центра масс однородного треугольника с вершинами $(0;0)$, $(1;0)$, $(0;1)$.
@answer 1/3
@solution
$x_c=\frac{\iint x\,dS}{S}=\frac{1/6}{1/2}=\frac13$ — точка пересечения медиан.

@task num 3
Найдите момент инерции однородного диска массой $m=2$ и радиусом $R=1$ относительно оси, проходящей через центр перпендикулярно диску.
@answer 1
@solution
$\rho=\frac{m}{\pi R^2}$. $I=\rho\int_0^{2\pi}\int_0^Rr^2\cdot r\,dr\,d\varphi=\rho\cdot\frac{\pi R^4}{2}=\frac{mR^2}2=1$.
